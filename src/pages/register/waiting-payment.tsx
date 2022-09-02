import React, { useEffect, useRef } from "react";
import intl from "react-intl-universal";
import { styled } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import { Account } from "../../model/general.types";
import ClipboardButton from "../../components/clipboard-button/clipboard-button.component";
import { getAccountBalance } from "../../services/account.service";

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
        closeTimer();
        onPaymentDetected(balance.toString());
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

  useEffect(() => {
    timer.current = setInterval(checkPayment, 10000);

    return closeTimer;
  }, []);

  return (
    <ContainerDiv>
      {networkInfo && (
        <Typography variant="h6" sx={{ margin: "auto" }}>
          {networkInfo}
        </Typography>
      )}
      <Typography variant="h5" sx={{ margin: "auto" }}>
        <span data-testid="account">{account}</span>
        <ClipboardButton text={account} />
      </Typography>
      <CircularProgress sx={{ margin: "auto", marginTop: "30px" }} />
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
