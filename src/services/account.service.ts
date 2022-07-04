import { BigNumber, providers, Wallet } from "ethers";
import { FdpStorage } from "@fairdatasociety/fdp-storage";
import { Account } from "../model/general.types";
import {
  RegisterData,
  RegisterResponse,
} from "../model/internal-messages.model";

console.log(process.env.REACT_APP_BEE_URL);

const fdp = new FdpStorage(
  process.env.REACT_APP_BEE_URL as string,
  process.env.REACT_APP_BEE_DEBUG_URL as string
);
const provider = new providers.JsonRpcProvider(
  process.env.REACT_APP_RPC_URL as string
);

export async function register({
  privateKey,
  mnemonic,
  username,
  password,
}: RegisterData): Promise<void> {
  try {
    let wallet: Wallet;

    if (privateKey) {
      wallet = new Wallet(privateKey);
    } else if (mnemonic) {
      wallet = Wallet.fromMnemonic(mnemonic);
    } else {
      throw new Error(
        "Private key or mnemonic must be set in order to register account"
      );
    }

    fdp.account.setActiveAccount(wallet);

    await fdp.account.register(username, password);

    console.log(`auth.listener: Successfully registered user ${username}`);

    return Promise.resolve();
  } catch (error) {
    console.error(
      `auth.listener: Error while trying to register new user ${username}`,
      error
    );
    throw error;
  }
}

export function isUsernameAvailable(username: string): Promise<boolean> {
  return fdp.ens.isUsernameAvailable(username);
}

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
