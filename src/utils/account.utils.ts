import { BigNumber, Wallet, providers } from "ethers";

export async function sendFunds(
  rpcUrl: string,
  fromKey: string,
  toAccount: string,
  amount: BigNumber
): Promise<providers.TransactionResponse> {
  const provider = new providers.JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(fromKey, provider);

  return wallet.sendTransaction({
    to: toAccount,
    value: amount,
  });
}
