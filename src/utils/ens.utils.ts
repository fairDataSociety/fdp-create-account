// TODO fdp-storage doesn't export types from fdp-contracts
export function getEnsConfig(): any {
  const ensRegistry = process.env.REACT_APP_ENS_REGISTRY_ADDRESS;
  const publicResolver = process.env.REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS;
  const subdomainRegistrar = process.env.REACT_APP_PUBLIC_RESOLVER_ADDRESS;

  if (ensRegistry && publicResolver && subdomainRegistrar) {
    return {
      ensOptions: {
        rpcUrl: process.env.REACT_APP_RPC_URL,
        contractAddresses: {
          ensRegistry,
          publicResolver,
          subdomainRegistrar,
        },
      },
    };
  }

  return undefined;
}
