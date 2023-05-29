import { Account, Mnemonic, PrivateKey } from "./general.types";
import { Network as NetworkModel } from "./network.model";

export interface Network {
  id: number;
  label: string;
  rpc: string;
}

export interface RegisterData {
  username: string;
  password: string;
  privateKey?: PrivateKey;
  mnemonic?: Mnemonic;
  network: NetworkModel;
}

export interface RegisterResponse {
  account: Account;
  mnemonic: Mnemonic;
  privateKey: PrivateKey;
}

export interface MigrateData {
  oldUsername: string;
  newUsername: string;
  password: string;
}
