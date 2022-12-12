import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/system";
import { HashRouter } from "react-router-dom";
import { CssBaseline, Typography } from '@mui/material'
import defaultTheme from './style/light-theme'
import { LocalesContextProvider } from './context/locales.context'
import Routes from './routes/routes'
import CenteredWrapper from './components/centered-wrapper/centered-wrapper.component'
import { FdpStorageProvider } from './context/fdp.context'
import intl from 'react-intl-universal'
import Footer from './components/footer/footer'
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum'

import { Web3Modal } from '@web3modal/react'

import { Chain, chain, configureChains, createClient, WagmiConfig } from 'wagmi'

const gnosis: Chain = {
  id: 100,
  name: 'Gnosis',
  network: 'xdai',
  nativeCurrency: {
    decimals: 18,
    name: 'XDAI',
    symbol: 'XDAI',
  },
  rpcUrls: {
    default: 'https://rpc.gnosischain.com',
  },
  blockExplorers: {
    default: { name: 'Gnosis scan', url: 'https://gnosisscan.io' },
  },
  testnet: false,
}
const chains = []

if (process.env.REACT_APP_ENVIRONMENT === 'GOERLI') {
  chains.push(chain.goerli)
} else {
  chains.push(gnosis)
}

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({
    projectId: process.env.REACT_APP_WEB3_MODAL_PROJECT_ID as string,
  }),
])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)

const App = () => {
  useEffect(() => {
    document.title = 'Fair Data Society'
  }, [])

  return (
    <>
      <HashRouter>
        <WagmiConfig client={wagmiClient}>
          <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <React.StrictMode>
              <FdpStorageProvider>
                <LocalesContextProvider>
                  <CenteredWrapper>
                    <Routes />
                  </CenteredWrapper>
                  <Footer />
                  <>
                    {process.env.REACT_APP_ENVIRONMENT !== 'GOERLI' && (
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{
                          marginBottom: '20px',
                          color: '#f19200',
                          fontSize: '12px',
                        }}
                      >
                        {intl.get('GOERLI_INFO')}
                        <div>
                          <div>
                            REACT_APP_BEE_URL: {process.env.REACT_APP_BEE_URL}
                          </div>
                          <div>
                            REACT_APP_FAIROS_URL: {process.env.REACT_APP_FAIROS_URL}
                          </div>
                          <div>
                            REACT_APP_BLOCKCHAIN_INFO:{' '}
                            {process.env.REACT_APP_BLOCKCHAIN_INFO}
                          </div>
                          <div>
                            REACT_APP_ENVIRONMENT:{' '}
                            {process.env.REACT_APP_ENVIRONMENT}
                          </div>
                          <div>
                            REACT_APP_ENVIRONMENT:{' '}
                            {process.env.REACT_APP_ENVIRONMENT}
                          </div>
                        </div>
                      </Typography>
                    )}
                  </>
                </LocalesContextProvider>
              </FdpStorageProvider>
            </React.StrictMode>
          </ThemeProvider>
        </WagmiConfig>
      </HashRouter>

      <Web3Modal
        projectId={process.env.REACT_APP_WEB3_MODAL_PROJECT_ID}
        ethereumClient={ethereumClient}
      />
    </>
  )
}

export default App;
