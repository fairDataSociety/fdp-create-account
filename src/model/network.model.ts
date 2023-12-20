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
      reverseResolver: string;
      nameResolver: string;
    };
    gasEstimation: number;
    performChecks: boolean;
    gasEstimation: number;
  };
}
