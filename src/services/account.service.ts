import { BigNumber, providers, Wallet } from "ethers";

import { Account } from "../model/general.types";
import { RegisterResponse } from "../model/internal-messages.model";

const provider = new providers.JsonRpcProvider(
  process.env.REACT_APP_RPC_URL as string
);

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
