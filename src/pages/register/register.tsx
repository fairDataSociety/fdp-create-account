import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import intl from "react-intl-universal";
import axios from "axios";
import Title from "../../components/title/title.component";
import { Button, CircularProgress, Typography } from "@mui/material";
import UsernamePassword from "./username-password";
import MnemonicConfirmation from "./mnemonic-confirmation";
import ErrorMessage from "../../components/error-message/error-message.component";
import { RegisterData } from "../../model/internal-messages.model";
import WaitingPayment from "./waiting-payment";
import { Account, Mnemonic } from "../../model/general.types";
import MnemonicComponent from "./mnemonic";
import Wrapper from "../../components/wrapper/wrapper.component";
import RegisterMethods from "./register-methods";
import EnterMnemonic from "./enter-mnemonic";
import { useFdpStorage } from "../../context/fdp.context";
import RouteCodes from "../../routes/route-codes";
import Link from "../../components/link/link";
import RegistrationComplete from "./registration-complete";

enum Steps {
  UsernamePassword,
  ChooseMethod,
  Mnemonic,
  MnemonicConfirmation,
  EnterMnemonic,
  WaitingPayment,
  Complete,
  Loading,
  Error,
}

const LoaderWrapperDiv = styled("div")({
  width: "100%",
  height: "20vh",
  display: "flex",
});

interface RegistrationState extends RegisterData {
  account: Account;
  mnemonic: Mnemonic;
  balance: string | null;
}

const emptyState: RegistrationState = {
  username: "",
  password: "",
  account: "",
  mnemonic: "",
  balance: null,
};

const Register = () => {
  const { fdpClient } = useFdpStorage();

  const [step, setStep] = useState<Steps>(Steps.UsernamePassword);
  const [data, setData] = useState<RegistrationState>(emptyState);
  const [error, setError] = useState<string | null>(null);

  const onUsernamePasswordSubmit = (registerData: RegisterData) => {
    setData({
      ...data,
      ...registerData,
    });
    setStep(Steps.ChooseMethod);
  };

  const onNewAccountSelect = () => {
    setStep(Steps.Loading);
    getMnemonic();
  };

  const onExistingAccountSelect = () => {
    setStep(Steps.EnterMnemonic);
  };

  const getMnemonic = async () => {
    try {
      const wallet = await fdpClient.account.createWallet();
      const response = {
        account: wallet.address,
        mnemonic: wallet.mnemonic.phrase,
      };
      setData({
        ...data,
        ...response,
      });
      setStep(Steps.Mnemonic);
    } catch (error) {
      console.error(error);
      setStep(Steps.Error);
    }
  };

  const onMnemonicRead = () => {
    setStep(Steps.MnemonicConfirmation);
  };

  const onMnemonicConfirmed = () => {
    setStep(Steps.WaitingPayment);
  };

  const onMnemonicEntered = (mnemonic: string) => {
    setData({
      ...data,
      mnemonic,
    });
  };

  const onPaymentConfirmed = (balance: string) => {
    setStep(Steps.Loading);
    setData({
      ...data,
      balance,
    });
    registerUser();
  };

  const onError = (error: unknown) => {
    setError((error as Error)?.message);
    setStep(Steps.Error);
  };

  const registerUser = async () => {
    try {
      const { username, password, mnemonic } = data;

      if (!mnemonic) {
        throw new Error("Mnemonic must be set in order to register account");
      }

      fdpClient.account.setAccountFromMnemonic(mnemonic);

      await fdpClient.account.register(username, password);

      setStep(Steps.Complete);
    } catch (error) {
      console.error(error);
      setError((error as Error)?.message);
      setStep(Steps.Error);
    }
  };

  const getStepInstructionMessage = (step: Steps): string => {
    let message: string | null = null;

    if (step === Steps.UsernamePassword) {
      message = "REGISTRATION_INSTRUCTIONS";
    } else if (step === Steps.ChooseMethod) {
      message = "REGISTRATION_OPTIONS_DESCRIPTION";
    } else if (step === Steps.Mnemonic) {
      message = "MNEMONIC_INSTRUCTIONS";
    } else if (step === Steps.MnemonicConfirmation) {
      message = "MNEMONIC_CONFIRMATION_INSTRUCTIONS";
    } else if (step === Steps.EnterMnemonic) {
      message = "EXISTING_ACCOUNT_INSTRUCTIONS";
    } else if (step === Steps.WaitingPayment) {
      message = "WAITING_FOR_PAYMENT_INSTRUCTIONS";
    } else if (step === Steps.Complete) {
      message = "REGISTRATION_COMPLETE";
    }

    return message ? intl.get(message) : "";
  };

  const reset = () => {
    setData(emptyState);
    setError(null);
    if (!data.account) {
      registerUser();
    } else if (data.balance) {
      onPaymentConfirmed(data.balance);
    } else {
      setStep(Steps.WaitingPayment);
    }
  };

  useEffect(() => {
    if (data.mnemonic && step === Steps.EnterMnemonic) {
      setStep(Steps.Loading);
      registerUser();
    }
  }, [data.mnemonic]);

  useEffect(() => {
    if (step === Steps.UsernamePassword) {
      setData(emptyState);
    }
  }, [step]);

  return (
    <Wrapper>
      <Title>{intl.get("REGISTER_TITLE")}</Title>
      <Typography
        variant="body1"
        align="center"
        sx={{
          marginTop: "20px",
        }}
      >
        {getStepInstructionMessage(step)}
      </Typography>
      {step === Steps.UsernamePassword && (
        <>
          <UsernamePassword onSubmit={onUsernamePasswordSubmit} />
          <Link to={RouteCodes.migrate}>{intl.get("MIGRATION_LINK")}</Link>
        </>
      )}
      {step === Steps.ChooseMethod && (
        <RegisterMethods
          onNewAccountSelect={onNewAccountSelect}
          onExistingAccountSelect={onExistingAccountSelect}
        />
      )}
      {step === Steps.Mnemonic && (
        <MnemonicComponent phrase={data.mnemonic} onConfirm={onMnemonicRead} />
      )}
      {step === Steps.MnemonicConfirmation && (
        <MnemonicConfirmation
          phrase={data.mnemonic}
          onConfirm={onMnemonicConfirmed}
        />
      )}
      {step === Steps.EnterMnemonic && (
        <EnterMnemonic onSubmit={onMnemonicEntered} />
      )}
      {step === Steps.WaitingPayment && (
        <WaitingPayment
          account={data.account}
          onPaymentDetected={onPaymentConfirmed}
          onError={onError}
        />
      )}
      {step === Steps.Complete && (
        <RegistrationComplete
          username={data.username}
          account={data.account}
          balance={data.balance as string}
        />
      )}
      {step === Steps.Loading && (
        <LoaderWrapperDiv>
          <CircularProgress sx={{ margin: "auto" }} />
        </LoaderWrapperDiv>
      )}
      {step === Steps.Error && (
        <LoaderWrapperDiv sx={{ flexDirection: "column" }}>
          <ErrorMessage>
            {intl.get("REGISTRATION_ERROR") + (error || "")}
          </ErrorMessage>
          <Button onClick={reset} sx={{ marginTop: "20px" }}>
            {intl.get("TRY_AGAIN")}
          </Button>
        </LoaderWrapperDiv>
      )}
    </Wrapper>
  );
};

export default Register;
