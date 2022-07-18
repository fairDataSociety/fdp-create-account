import React from "react";
import { ThemeProvider } from "@mui/system";
import { HashRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import defaultTheme from "./style/light-theme";
import { LocalesContextProvider } from "./context/locales.context";
import Routes from "./routes/routes";
import CenteredWrapper from "./components/centered-wrapper/centered-wrapper.component";
import { FdpStorageProvider } from "./context/fdp.context";

/* eslint-disable no-console */
import { BeeDebug, DebugPostageBatch } from "@ethersphere/bee-js";

async function sleep(ms = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testsSetup(): Promise<void> {
  if (!process.env.BEE_POSTAGE) {
    try {
      console.log("Creating postage stamps...");
      const beeDebugUrl =
        process.env.BEE_DEBUG_API_URL || "http://localhost:1635/";
      const beeDebug = new BeeDebug(beeDebugUrl);
      const userBatchID = await beeDebug.createPostageBatch("1", 20);
      process.env.BEE_POSTAGE = userBatchID;
      console.log("BEE_POSTAGE: ", userBatchID);
      //wait for chunk to be usable
      let postageBatch: DebugPostageBatch;
      do {
        postageBatch = await beeDebug.getPostageBatch(process.env.BEE_POSTAGE);

        console.log("Waiting 1 sec for batch ID settlement...");
        await sleep();
      } while (!postageBatch.usable);
    } catch (e) {
      // It is possible that for unit tests the Bee nodes does not run
      // so we are only logging errors and not leaving them to propagate
      console.error(e);
    }
  }
}
testsSetup().then();
const App = () => (
  <HashRouter>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <React.StrictMode>
        <FdpStorageProvider>
          <LocalesContextProvider>
            <CenteredWrapper>
              <Routes />
            </CenteredWrapper>
          </LocalesContextProvider>
        </FdpStorageProvider>
      </React.StrictMode>
    </ThemeProvider>
  </HashRouter>
);

export default App;
