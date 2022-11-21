import { createContext, ReactNode, useContext } from "react";
import { FdpStorage } from "@fairdatasociety/fdp-storage";
import { getEnsConfig } from "../utils/ens.utils";
import { GLOBAL_POSTAGE_BATCH_ID } from "../constants/constants";

const fdpClient = new FdpStorage(
  process.env.REACT_APP_BEE_URL as string,
  (process.env.REACT_APP_BATCH_ID || GLOBAL_POSTAGE_BATCH_ID) as any,
  getEnsConfig()
);

interface FdpStorageContextProps {
  children: ReactNode;
}

interface FdpStorageContextI {
  fdpClient: FdpStorage;
}

const FdpStorageContext = createContext<FdpStorageContextI>({
  fdpClient,
});

export function FdpStorageProvider(props: FdpStorageContextProps) {
  const { children } = props;

  return (
    <FdpStorageContext.Provider value={{ fdpClient }}>
      {children}
    </FdpStorageContext.Provider>
  );
}

export function useFdpStorage() {
  return useContext(FdpStorageContext);
}

export default FdpStorageContext;
