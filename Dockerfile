FROM node:lts as build

ARG REACT_APP_BEE_URL
ENV REACT_APP_BEE_URL=$REACT_APP_BEE_URL
ARG REACT_APP_BEE_DEBUG_URL
ENV REACT_APP_BEE_DEBUG_URL=$REACT_APP_BEE_DEBUG_URL
ARG REACT_APP_RPC_URL
ENV REACT_APP_RPC_URL=$REACT_APP_RPC_URL
ARG REACT_APP_ENS_REGISTRY_ADDRESS
ENV REACT_APP_ENS_REGISTRY_ADDRESS=$REACT_APP_ENS_REGISTRY_ADDRESS
ARG REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS
ENV REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS=$REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS
ARG REACT_APP_PUBLIC_RESOLVER_ADDRESS
ENV REACT_APP_PUBLIC_RESOLVER_ADDRESS=$REACT_APP_PUBLIC_RESOLVER_ADDRESS
ARG REACT_APP_FAIROS_URL
ENV REACT_APP_FAIROS_URL=$REACT_APP_FAIROS_URL
ARG REACT_APP_BLOCKCHAIN_INFO
ENV REACT_APP_BLOCKCHAIN_INFO=$REACT_APP_BLOCKCHAIN_INFO

WORKDIR /base
COPY *.json ./
RUN npm install
COPY . .
SHELL ["/bin/bash", "-eo", "pipefail", "-c"]
RUN env |grep REACT > .default.env
RUN npm run build

#webserver
FROM nginx:stable-alpine
COPY --from=build /base/build /usr/share/nginx/html
RUN chown -R nginx /usr/share/nginx/html
RUN echo "real_ip_header X-Forwarded-For;" \
    "real_ip_recursive on;" \
    "set_real_ip_from 0.0.0.0/0;" > /etc/nginx/conf.d/ip.conf
RUN sed -i '/index  index.html index.htm/c\        try_files $uri /index.html;' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
