import { BigNumber } from "ethers";

export interface Network {
  label: string;
  minBalance: BigNumber;
  config: {
    rpcUrl: string;
    contractAddresses: {
      ensRegistry: string;
      fdsRegistrar: string;
      publicResolver: string;
    };
    gasEstimation: number;
    performChecks: boolean;
  };
}
