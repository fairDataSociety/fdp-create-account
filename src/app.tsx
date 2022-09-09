import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/system";
import { HashRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import defaultTheme from "./style/light-theme";
import { LocalesContextProvider } from "./context/locales.context";
import Routes from "./routes/routes";
import CenteredWrapper from "./components/centered-wrapper/centered-wrapper.component";
import { FdpStorageProvider } from "./context/fdp.context";
import Footer from "./components/footer/footer";

const App = () => {
  useEffect(() => {
    document.title = "Fair Data Society";
  }, []);

  return (
    <HashRouter>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <React.StrictMode>
          <FdpStorageProvider>
            <LocalesContextProvider>
              <CenteredWrapper>
                <Routes />
              </CenteredWrapper>
              <Footer />
            </LocalesContextProvider>
          </FdpStorageProvider>
        </React.StrictMode>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
