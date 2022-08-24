import { FdpContracts } from "@fairdatasociety/fdp-storage";
// TODO temporary because the fdp-storage is not exporting these values
const { Environments, getEnvironmentConfig } = FdpContracts || {};

function getEnvironment() {
  const environment = process.env.REACT_APP_ENVIRONMENT;

  if (environment === "LOCALHOST") {
    return getEnvironmentConfig(Environments.LOCALHOST);
  } else if (environment === "GOERLI") {
    return getEnvironmentConfig(Environments.GOERLI);
  }

  return undefined;
}

export function getEnsConfig(): any {
  let ensConfig: any = getEnvironment();
  const ensRegistry = process.env.REACT_APP_ENS_REGISTRY_ADDRESS;
  const publicResolver = process.env.REACT_APP_PUBLIC_RESOLVER_ADDRESS;
  const fdsRegistrar = process.env.REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS;
  const rpcUrl = process.env.REACT_APP_RPC_URL;
  const ensDomain = "fds";

  if (!rpcUrl && !ensRegistry && !publicResolver && !fdsRegistrar) {
    return ensConfig
      ? {
          ensConfig,
          ensDomain,
        }
      : undefined;
  }

  ensConfig = ensConfig || {};

  if (rpcUrl) {
    ensConfig.rpcUrl = rpcUrl;
  }

  if (ensRegistry && publicResolver && fdsRegistrar) {
    ensConfig.contractAddresses = {
      ensRegistry,
      publicResolver,
      fdsRegistrar,
    };
  }

  return {
    ensOptions: {
      performChecks: true,
      ...ensConfig,
    },
    ensDomain,
  };
}

export function isPasswordValid(password: string): boolean {
  // TODO check if password contains lowercase and uppercase letters
  return typeof password === "string" && password.length >= 8;
}
