import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FdpStorage } from "@fairdatasociety/fdp-storage";
import { FDS_DOMAIN, GLOBAL_POSTAGE_BATCH_ID } from "../constants/constants";
import { Network } from "../model/network.model";
import { networks, useNetworks } from "./network.context";
import { useRef } from "react";

function createFdpClient(network: Network): FdpStorage {
  return new FdpStorage(
    process.env.REACT_APP_BEE_URL as string,
    (process.env.REACT_APP_BATCH_ID || GLOBAL_POSTAGE_BATCH_ID) as any,
    {
      ensOptions: network.config,
      ensDomain: FDS_DOMAIN,
    }
  );
}

interface FdpStorageContextProps {
  children: ReactNode;
}

interface FdpStorageContextI {
  fdpClient: FdpStorage;
  updateFdpClient: (network: Network) => FdpStorage;
}

const FdpStorageContext = createContext<FdpStorageContextI>({
  fdpClient: createFdpClient(networks[0]),
  updateFdpClient: (network) => createFdpClient(network),
});

export function FdpStorageProvider({ children }: FdpStorageContextProps) {
  const { currentNetwork, setCurrentNetwork } = useNetworks();
  const prevNetwork = useRef<Network>();
  const [fdpClient, setFdpClient] = useState<FdpStorage>(
    createFdpClient(currentNetwork)
  );
  prevNetwork.current = currentNetwork;

  const updateFdpClient = (network: Network) => {
    setCurrentNetwork(network);
    const fdpClient = createFdpClient(network);
    setFdpClient(fdpClient);
    return fdpClient;
  };

  useEffect(() => {
    if (prevNetwork.current !== currentNetwork) {
      setFdpClient(createFdpClient(currentNetwork));
    }
  }, [currentNetwork]);

  return (
    <FdpStorageContext.Provider value={{ fdpClient, updateFdpClient }}>
      {children}
    </FdpStorageContext.Provider>
  );
}

export function useFdpStorage() {
  return useContext(FdpStorageContext);
}

export default FdpStorageContext;
