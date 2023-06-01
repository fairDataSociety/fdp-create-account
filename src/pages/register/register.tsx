import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import intl from "react-intl-universal";
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
import { BigNumber, Wallet, utils } from "ethers";
import { useAccount } from "../../context/account.context";
import { useNetworks } from "../../context/network.context";
import { sendFunds } from "../../utils/account.utils";
import axios from "axios";

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

interface RegistrationState extends Omit<RegisterData, "network"> {
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
  const { estimateGas, checkMinBalance, inviteKey, getAccountBalance } =
    useAccount();
  const { currentNetwork } = useNetworks();

  const [step, setStep] = useState<Steps>(Steps.UsernamePassword);
  const [minBalance, setMinBalance] = useState<BigNumber>(
    currentNetwork.minBalance
  );
  const [data, setData] = useState<RegistrationState>(emptyState);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getMinBalance = async () => {
    const wallet = fdpClient.account.wallet;
    const account = wallet?.address as string;
    const publicKey = fdpClient.account.publicKey as string;

    const price = await estimateGas(
      data.username,
      account,
      publicKey,
      minBalance
    );

    setMinBalance(price.mul(BigNumber.from(2)));
  };

  const onUsernamePasswordSubmit = (registerData: RegisterData) => {
    setData({
      ...data,
      ...registerData,
    });
    setMinBalance(registerData.network.minBalance);
    if (!inviteKey) {
      setStep(Steps.ChooseMethod);
    }
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
      getMinBalance();
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
    if (inviteKey) {
      return checkInviteAccount();
    }
    setStep(Steps.WaitingPayment);
  };

  const onMnemonicEntered = (mnemonic: string) => {
    setData({
      ...data,
      mnemonic,
    });
  };

  const onMnemonicChecking = async () => {
    try {
      fdpClient.account.setAccountFromMnemonic(data.mnemonic);

      const wallet = fdpClient.account.wallet;
      const account = wallet?.address as string;

      await getMinBalance();

      const canProceed = await checkMinBalance(account, minBalance);

      setData({
        ...data,
        account,
      });

      if (!canProceed) {
        setStep(Steps.WaitingPayment);
        return;
      }

      registerUser();
    } catch (error) {
      onError(error);
    }
  };

  const checkInviteAccount = async () => {
    try {
      setStep(Steps.Loading);
      const wallet = new Wallet(inviteKey as string);
      setLoadingMessage("CHECKING_BALANCE");
      const balance = await getAccountBalance(wallet.address);
      // TODO The value should be checked
      const gasPrice = utils.parseUnits("0.0001", "ether");

      if (balance.gt(BigNumber.from(gasPrice))) {
        setLoadingMessage("TRANSFERRING_FROM_INVITE");
        const tx = await sendFunds(
          currentNetwork.config.rpcUrl,
          inviteKey as string,
          Wallet.fromMnemonic(data.mnemonic).address,
          balance.sub(gasPrice)
        );
        await tx.wait();
      }

      if (balance.gte(minBalance)) {
        return onPaymentConfirmed(`${utils.formatEther(balance)} ETH`);
      }
      setStep(Steps.WaitingPayment);
    } catch (error) {
      console.error(error);
      setError((error as Error)?.message);
      setStep(Steps.Error);
    } finally {
      setLoadingMessage(null);
    }
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

      setLoadingMessage("CHECKING_BALANCE");

      const canProceed = await checkMinBalance(
        fdpClient.account.wallet?.address as string,
        minBalance
      );

      if (!canProceed) {
        throw new Error("Insufficient funds");
      }

      setLoadingMessage("REGISTERING_NEW_ACCOUNT");

      await fdpClient.account.register(username, password);

      if (inviteKey && process.env.REACT_APP_INVITE_URL) {
        const inviteWallet = new Wallet(inviteKey);
        const userWallet = new Wallet(fdpClient.account.wallet!.privateKey);

        setLoadingMessage("REGISTERING_INVITATION");
        await axios.post(process.env.REACT_APP_INVITE_URL, {
          invite_address: inviteWallet.address,
          link_address: userWallet.address,
          invite_signature: inviteWallet.signMessage(inviteWallet.address),
          link_signature: userWallet.signMessage(userWallet.address),
        });
      }

      setStep(Steps.Complete);
    } catch (error) {
      console.error(error);
      setError((error as Error)?.message);
      setStep(Steps.Error);
    } finally {
      setLoadingMessage(null);
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
      return (
        intl.get(message) +
        " " +
        intl.get("WAITING_FOR_PAYMENT_AMOUNT", {
          price: utils.formatEther(minBalance),
        })
      );
    } else if (step === Steps.Complete) {
      message = "REGISTRATION_COMPLETE";
    } else if (step === Steps.Loading && loadingMessage) {
      return intl.get(loadingMessage) + "...";
    }

    return message ? intl.get(message) : "";
  };

  const reset = () => {
    setData(emptyState);
    setError(null);
    setLoadingMessage(null);
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
      onMnemonicChecking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.mnemonic]);

  useEffect(() => {
    if (step === Steps.UsernamePassword) {
      setData(emptyState);
    }
  }, [step]);

  useEffect(() => {
    if (
      step === Steps.UsernamePassword &&
      data.username &&
      data.password &&
      inviteKey
    ) {
      onNewAccountSelect();
    }
  }, [step, data.username, data.password, inviteKey]);

  return (
    <Wrapper>
      {/* {process.env.REACT_APP_ENVIRONMENT === 'GOERLI' && (
        <Typography
          variant="body1"
          align="center"
          sx={{
            marginBottom: '20px',
            color: '#f19200',
            fontSize: '14px',
          }}
        >
          {intl.get('TESTNET_INFO')}
          <div>
            <div>REACT_APP_BEE_URL: {process.env.REACT_APP_BEE_URL}</div>
            <div>REACT_APP_FAIROS_URL: {process.env.REACT_APP_FAIROS_URL}</div>
            <div>
              REACT_APP_BLOCKCHAIN_INFO: {process.env.REACT_APP_BLOCKCHAIN_INFO}
            </div>
            <div>REACT_APP_ENVIRONMENT: {process.env.REACT_APP_ENVIRONMENT}</div>
            <div>REACT_APP_ENVIRONMENT: {process.env.REACT_APP_ENVIRONMENT}</div>
          </div>
        </Typography>
      )} */}

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
          minBalance={minBalance}
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
