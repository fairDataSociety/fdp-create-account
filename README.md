# FDP Create Account

Web application for registering new FDS accounts.

## Configuration

To configure the application, create an `.env` file in the root directory. Set the following properties:

- **REACT_APP_BEE_URL** - Address of a bee node
- **REACT_APP_BEE_DEBUG_URL** - Address of bee debug API
- **REACT_APP_RPC_URL** - Address of RPC provider
- **REACT_APP_ENS_REGISTRY_ADDRESS** - ENS Registry contract address
- **REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS** - Subdomain registrar contract address
- **REACT_APP_PUBLIC_RESOLVER_ADDRESS** - Public Resolver contract address

If the latest `fdp-contract` image is used as RPC provider, then contract addresses can be omitted.

## Testnet ENS deployment
- **FDSRegistrar** deployed to: 0xF11180fC2D159190a161d636f7AD1b2A05657323
- **ENSRegistry** deployed to: 0xd55cc6b1070c4106bbAB2DC7a4C23A20CD3528a0
- **PublicResolver** deployed to: 0x920A3959c37036B59AA21cD8f259e91830CA8BF8



> **_NOTE_:** Check the `.default.env` file for more information

## Build

To build the project:

```bash
npm run build
```

Files generated inside the `build` folder can be deployed to a web server.

## Test

Before running tests start the [fdp-play](https://github.com/fairDataSociety/fdp-play) environment:

```bash
fdp-play start
```

Then start a local web server:

```bash
npm start
```

Then run tests:

```bash
npm run test:puppeteer
```
