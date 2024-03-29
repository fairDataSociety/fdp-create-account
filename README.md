# FDP Create Account

Web application for registering new FDS accounts.

## Configuration

To configure the application, create an `.env` file in the root directory. Set the following properties:

- **REACT_APP_BEE_URL** - Address of a bee node
- **REACT_APP_BEE_DEBUG_URL** - Address of bee debug API
- **REACT_APP_FAIROS_URL** - FairOS URL (used only for migration)
- **REACT_APP_FAIRDRIVE_URL** - Fairdrive URL
- **REACT_APP_BATCH_ID** - Postage batch ID (optional)
- **REACT_APP_BLOCKCHAIN_INFO** - Name of the blockchain network displayed to users (optional) ie. Sepolia,
- **REACT_APP_ENVIRONMENT** - ENS environment: LOCALHOST or SEPOLIA. If the environment is specified the following variables are not required.
- **REACT_APP_RPC_URL** - Address of RPC provider
- **REACT_APP_ENS_REGISTRY_ADDRESS** - ENS Registry contract address
- **REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS** - Subdomain registrar contract address
- **REACT_APP_PUBLIC_RESOLVER_ADDRESS** - Public Resolver contract address
- **REACT_APP_WEB3_MODAL_PROJECT_ID** - Web3Modal Project ID

If the latest `fdp-contract` image is used as RPC provider, then contract addresses can be omitted.

## Testnet ENS deployment

- **FDSRegistrar** deployed to: 0xF11180fC2D159190a161d636f7AD1b2A05657323
- **ENSRegistry** deployed to: 0xd55cc6b1070c4106bbAB2DC7a4C23A20CD3528a0
- **PublicResolver** deployed to: 0x920A3959c37036B59AA21cD8f259e91830CA8BF8

# FairOS Testnet uses these Deployment addresses

- FDS Registry: 0xF4C9Cd25031E3BB8c5618299bf35b349c1aAb6A9
- ENS Registry: 0x42B22483e3c8dF794f351939620572d1a3193c12
- PublicResolver: 0xbfeCC6c32B224F7D0026ac86506Fe40A9607BD14

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

To buy postage stamp for fdp-play

```bash
 curl -s -XPOST http://localhost:1635/stamps/10000000/18
```

you will get respons like: `{"batchID":"ea088d3f65f0f3ac2c3c6684b5e40e80e6ea0234e59b64aa156a9bfb7064a66c"}`

To fund account from fdp-play

```bash
 node ./scripts/fund-new-account.js <account_address> <amount>
```

### Import account with mnemonic
