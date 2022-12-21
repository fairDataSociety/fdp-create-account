import { BigNumber, providers, Wallet } from "ethers";
import { MIN_BALANCE } from "../constants/constants";

import { Account } from "../model/general.types";
import { RegisterResponse } from "../model/internal-messages.model";
import { getEnsConfig } from "../utils/ens.utils";

const ensConfig = getEnsConfig();

const provider = new providers.JsonRpcProvider(ensConfig.ensOptions.rpcUrl);

export async function generateWallet(): Promise<RegisterResponse> {
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
}

export async function getAccountBalance(account: Account): Promise<BigNumber> {
  return provider.getBalance(account);
}

export async function checkMinBalance(account: Account): Promise<boolean> {
  const balance = await getAccountBalance(account);

  return balance.gte(MIN_BALANCE);
}
