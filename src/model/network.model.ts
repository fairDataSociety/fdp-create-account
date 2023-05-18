export interface Network {
  label: string;
  config: {
    rpcUrl: string;
    contractAddresses: {
      ensRegistry: string;
      fdsRegistrar: string;
      publicResolver: string;
    };
    performChecks: boolean;
  };
}
