import React, { useState } from "react";
import { createContext, useContext } from "react";
import { Network } from "../model/network.model";
import {
  getEnsEnvironmentConfig,
  Environments,
} from "@fairdatasociety/fdp-contracts-js";
import { utils } from "ethers";

export const networks: Network[] = [
  // TODO Replace with default ENS config when becomes available
  {
    label: "Sepolia",
    minBalance: utils.parseUnits("0.0005", "ether"),
    config: {
      rpcUrl: "https://rpc.sepolia.org/",
      contractAddresses: {
        ensRegistry: "0x42a96D45d787685ac4b36292d218B106Fb39be7F",
        fdsRegistrar: "0xFBF00389140C00384d88d458239833E3231a7414",
        publicResolver: "0xC904989B579c2B216A75723688C784038AA99B56",
      },
      performChecks: true,
    },
  },
  {
    label: "Görli",
    config: getEnsEnvironmentConfig(Environments.GOERLI),
    minBalance: utils.parseUnits("0.05", "ether"),
  },
];

if (process.env.REACT_APP_ENVIRONMENT === "LOCALHOST") {
  networks.unshift({
    label: "FDP Play",
    minBalance: utils.parseUnits("0.01", "ether"),
    config: getEnsEnvironmentConfig(Environments.LOCALHOST),
  });
}

export const mainNetworkLabel =
  process.env.REACT_APP_ENVIRONMENT === "LOCALHOST" ? "FDP Play" : "Sepolia";

export function getMainNetwork(): Network {
  return networks.find(({ label }) => label === mainNetworkLabel) as Network;
}

export interface INetworkContext {
  networks: Network[];
  currentNetwork: Network;
  setCurrentNetwork: (network: Network) => void;
}

const NetworkContext = createContext<INetworkContext>({
  networks,
  currentNetwork: networks[0],
  setCurrentNetwork: () => {},
});

export const useNetworks = () => useContext(NetworkContext);

export interface NetworkContextProps {
  children: React.ReactNode;
}

export const NetworkProvider = ({ children }: NetworkContextProps) => {
  const [currentNetwork, setCurrentNetwork] = useState<Network>(networks[0]);

  return (
    <NetworkContext.Provider
      value={{ networks, currentNetwork, setCurrentNetwork }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
