import { Account, Mnemonic, PrivateKey } from "./general.types";

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
