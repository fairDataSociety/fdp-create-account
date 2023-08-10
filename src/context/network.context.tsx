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
    config: getEnsEnvironmentConfig(Environments.SEPOLIA),
  },
  {
    label: "Görli",
    config: getEnsEnvironmentConfig(Environments.GOERLI),
    minBalance: utils.parseUnits("0.05", "ether"),
  },
  {
    label: "Optimism Goerli",
    config: getEnsEnvironmentConfig(Environments.OPTIMISM_GOERLI),
    minBalance: utils.parseUnits("0.001", "ether"),
  },
  {
    label: "Arbitrum Goerli",
    config: getEnsEnvironmentConfig(Environments.ARBITRUM_GOERLI),
    minBalance: utils.parseUnits("0.001", "ether"),
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
