import { useEffect, useRef } from "react";
import { BigNumber, utils } from "ethers";
import intl from "react-intl-universal";
import { styled } from "@mui/system";
import { CircularProgress, Typography, Button } from "@mui/material";
import { Account } from "../../model/general.types";
import ClipboardButton from "../../components/clipboard-button/clipboard-button.component";
import {
  useAccount as useWagmiAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { useAccount } from "../../context/account.context";
import { useNetworks } from "../../context/network.context";

export interface WaitingPaymentProps {
  account: Account;
  minBalance: BigNumber;
  onPaymentDetected: (balance: string) => void;
  onError: (error: unknown) => void;
}

const ContainerDiv = styled("div")({
  display: "flex",
  flexDirection: "column",
  margin: "20px auto 0 auto",
});

const WaitingPayment = ({
  account,
  minBalance,
  onPaymentDetected,
  onError,
}: WaitingPaymentProps) => {
  const { isConnected } = useWagmiAccount();
  const { getAccountBalance } = useAccount();
  const { currentNetwork } = useNetworks();
  const { config } = usePrepareSendTransaction({
    request: {
      to: account,
      value: minBalance,
    },
  });
  const { sendTransaction, data } = useSendTransaction(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const timer = useRef<NodeJS.Timeout | null>();

  const checkPayment = async () => {
    try {
      const balance = await getAccountBalance(account); // in wei

      if (balance.gte(minBalance)) {
        closeTimer();
        onPaymentDetected(`${utils.formatEther(balance)} ETH`);
      }
    } catch (error) {
      console.error(error);
      closeTimer();
      onError(error);
    }
  };

  const closeTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  if (isSuccess) {
    checkPayment();
  }

  useEffect(() => {
    timer.current = setInterval(checkPayment, 15000);

    return closeTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContainerDiv>
      <Typography variant="h6" sx={{ margin: "auto" }}>
        {currentNetwork.label}
      </Typography>

      <Typography variant="h5" sx={{ margin: "auto" }}>
        <span data-testid="account">{account}</span>
        <ClipboardButton text={account} />
      </Typography>

      <CircularProgress sx={{ margin: "auto", marginTop: "30px" }} />

      {isConnected && (
        <>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading || !sendTransaction}
            onClick={(e) => {
              e.preventDefault();
              sendTransaction?.();
            }}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
          {isSuccess && (
            <div>
              Successfully sent {utils.formatEther(minBalance)} ether to{" "}
              {account}
            </div>
          )}
        </>
      )}

      <Typography
        variant="body1"
        align="center"
        sx={{ margin: "auto", marginTop: "30px" }}
      >
        {intl.get("DISCLAIMER")}
      </Typography>
    </ContainerDiv>
  );
};

export default WaitingPayment;
