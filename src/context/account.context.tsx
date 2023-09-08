import React, { useMemo, useState } from "react";
import { createContext, useContext } from "react";
import { BigNumber, providers, Wallet } from "ethers";
import { ENS } from "@fairdatasociety/fdp-contracts-js";
import { RegisterResponse } from "../model/internal-messages.model";
import { Account } from "../model/general.types";
import { useNetworks } from "./network.context";
import { FDS_DOMAIN } from "../constants/constants";

export interface IAccountContext {
  inviteKey: string | null;
  setInviteKey: (key: string) => void;
  generateWallet: () => Promise<RegisterResponse>;
  getAccountBalance: (account: Account) => Promise<BigNumber>;
  checkMinBalance: (
    account: Account,
    minBalance: BigNumber
  ) => Promise<boolean>;
  estimateGas: (defaultMinBalance: BigNumber) => Promise<BigNumber>;
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
    () =>
      new ENS(
        currentNetwork.label === "Sepolia"
          ? { ...currentNetwork.config, rpcUrl: "https://sepolia.dev.fairdatasociety.org/" }
          : currentNetwork.config,
        provider,
        FDS_DOMAIN
      ),
    [currentNetwork, provider]
  );

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

  const estimateGas = (defaultMinBalance: BigNumber): Promise<BigNumber> => {
    try {
      return ens.registerUsernameApproximatePrice()
    } catch (error) {
      console.error(error);

      return Promise.resolve(defaultMinBalance);
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
