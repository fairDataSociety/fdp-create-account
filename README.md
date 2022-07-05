# FDP Create Account

Web application for registering new FDS accounts.

## Configuration

To configure the application, create an `.env` file in the root directory. Set the following properties:

- **REACT_APP_BEE_URL** - Address of a bee node
- **REACT_APP_BEE_DEBUG_URL** - Address of bee debug API
- **REACT_APP_RPC_URL** - Address of RPC provider

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

Then run tests:

```bash
npm run test:puppeteer
```
