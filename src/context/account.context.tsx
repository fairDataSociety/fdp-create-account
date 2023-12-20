import React, { useMemo, useState } from "react";
import { createContext, useContext } from "react";
import { BigNumber, providers, utils, Wallet } from "ethers";
import { ENS } from "@fairdatasociety/fdp-contracts-js";
import {
  Alchemy,
  Network as AlchemyNetwork,
  AlchemySettings,
} from "alchemy-sdk";
import { RegisterResponse } from "../model/internal-messages.model";
import { Account } from "../model/general.types";
import { useNetworks } from "./network.context";
import { FDS_DOMAIN } from "../constants/constants";
import { Network } from "../model/network.model";

function getAlchemySettings(network: Network): AlchemySettings | null {
  switch (network.label) {
    case "Görli":
      return {
        apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
        network: AlchemyNetwork.ETH_GOERLI,
      };
    case "Sepolia":
      return {
        url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      };
    default:
      return null;
  }
}

export interface IAccountContext {
  inviteKey: string | null;
  setInviteKey: (key: string) => void;
  generateWallet: () => Promise<RegisterResponse>;
  getAccountBalance: (account: Account) => Promise<BigNumber>;
  checkMinBalance: (
    account: Account,
    minBalance: BigNumber
  ) => Promise<boolean>;
  estimateGas: (
    username: string,
    account: string,
    publicKey: string,
    defaultMinBalance: BigNumber
  ) => Promise<BigNumber>;
}

const AccountContext = createContext<IAccountContext>({
  inviteKey: null,
  setInviteKey: (key: string) => {},
  generateWallet: () => Promise.resolve(null as unknown as RegisterResponse),
  getAccountBalance: () => Promise.resolve(BigNumber.from(0)),
  checkMinBalance: () => Promise.resolve(false),
  estimateGas: () => Promise.resolve(BigNumber.from(0)),
});

export const useAccount = () => useContext(AccountContext);

export interface AccountContextProps {
  children: React.ReactNode;
}

export const AccountProvider = ({ children }: AccountContextProps) => {
  const [inviteKey, setInviteKey] = useState<string | null>(null);
  const { currentNetwork } = useNetworks();

  const provider = useMemo(
    () => new providers.JsonRpcProvider(currentNetwork.config.rpcUrl),
    [currentNetwork]
  );

  const ens = useMemo(
    () => new ENS(currentNetwork.config, provider, FDS_DOMAIN),
    [currentNetwork, provider]
  );

  const alchemy = useMemo(() => {
    const alchemySettings = getAlchemySettings(currentNetwork);
    return alchemySettings ? new Alchemy(alchemySettings) : null;
  }, [currentNetwork]);

  const generateWallet = async (): Promise<RegisterResponse> => {
    try {
      const wallet = Wallet.createRandom();
      const account = await wallet.getAddress();

      return {
        account,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
      };
    } catch (error) {
      console.error(`auth.listeer: Couldn't generate mnemonic`, error);
      throw error;
    }
  };

  const getAccountBalance = (account: Account): Promise<BigNumber> => {
    return provider.getBalance(account);
  };

  const checkMinBalance = async (
    account: Account,
    minBalance: BigNumber
  ): Promise<boolean> => {
    const balance = await getAccountBalance(account);

    return balance.gte(minBalance);
  };

  const estimateGas = async (
    username: string,
    account: string,
    publicKey: string,
    defaultMinBalance: BigNumber
  ): Promise<BigNumber> => {
    try {
      const [amount, price] = await Promise.all([
        ens.registerUsernameEstimateGas(username, account, publicKey),
        alchemy
          ? alchemy.core.getGasPrice()
          : Promise.resolve(BigNumber.from(100000000000)),
      ]);

      const gasPriceInEth = Number(
        utils.formatEther(price.mul(BigNumber.from(amount)))
      );

      return utils.parseEther(String(Math.ceil(gasPriceInEth * 1000) / 1000));
    } catch (error) {
      console.error(error);

      return defaultMinBalance;
    }
  };

  return (
    <AccountContext.Provider
      value={{
        inviteKey,
        setInviteKey,
        generateWallet,
        getAccountBalance,
        checkMinBalance,
        estimateGas,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
