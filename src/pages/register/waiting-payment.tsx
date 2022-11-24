import React, { useEffect, useRef } from "react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { utils } from "ethers";
import intl from "react-intl-universal";
import { styled } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import { Account } from "../../model/general.types";
import ClipboardButton from "../../components/clipboard-button/clipboard-button.component";
import { getAccountBalance } from "../../services/account.service";
import {
  useAccount,
  useEnsName,
  useConnect,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { Web3Button } from "@web3modal/react";

export interface WaitingPaymentProps {
  account: Account;
  onPaymentDetected: (balance: string) => void;
  onError: (error: unknown) => void;
}

const ContainerDiv = styled("div")({
  display: "flex",
  flexDirection: "column",
  margin: "20px auto 0 auto",
});

const networkInfo = process.env.REACT_APP_BLOCKCHAIN_INFO;

const WaitingPayment = ({
  account,
  onPaymentDetected,
  onError,
}: WaitingPaymentProps) => {
  const timer = useRef<NodeJS.Timeout | null>();

  const checkPayment = async () => {
    try {
      const balance = await getAccountBalance(account);

      if (balance.gt(0)) {
        onPaymentDetected(`${utils.formatEther(balance)} ETH`);
      }
    } catch (error) {
      console.error(error);
      onError(error);
    }
  };

  const { address, isConnected } = useAccount();

  const amount = "0.01";
  const { config } = usePrepareSendTransaction({
    request: {
      to: account,
      value: utils.parseEther(amount),
    },
  });

  const { sendTransaction, data } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  if (isSuccess) {
    checkPayment();
  }

  return (
    <ContainerDiv>
      {networkInfo && (
        <Typography variant="h6" sx={{ margin: "auto" }}>
          {networkInfo}
        </Typography>
      )}
      <Web3Button />

      {isConnected && (
        <>
          <Typography variant="h5" sx={{ margin: "auto" }}>
            <span data-testid="account">{account}</span>
            <ClipboardButton text={account} />
          </Typography>

          {isLoading && (
            <CircularProgress sx={{ margin: "auto", marginTop: "30px" }} />
          )}

          <button
            disabled={isLoading || !sendTransaction}
            onClick={() => sendTransaction?.()}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
          {isSuccess && (
            <div>
              Successfully sent {amount} ether to {account}
              <div>
                <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
              </div>
            </div>
          )}
          <Typography
            variant="body1"
            align="center"
            sx={{ margin: "auto", marginTop: "30px" }}
          >
            {intl.get("DISCLAIMER")}
          </Typography>
        </>
      )}
    </ContainerDiv>
  );
};

export default WaitingPayment;
