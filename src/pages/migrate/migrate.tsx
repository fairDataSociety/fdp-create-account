import React, { useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import { Button, CircularProgress, Typography } from "@mui/material";
import DoneAll from "@mui/icons-material/DoneAll";
import MigrateForm from "./migrate-form";
import Wrapper from "../../components/wrapper/wrapper.component";
import Title from "../../components/title/title.component";
import Link from "../../components/link/link";
import RouteCodes from "../../routes/route-codes";
import { FlexColumnDiv, FlexDiv } from "../../components/utils/utils";
import ErrorMessage from "../../components/error-message/error-message.component";
import { useLocales } from "../../context/locales.context";

enum Steps {
  UsernamePassword,
  Complete,
  Loading,
  Error,
}

const LoaderWrapperDiv = styled("div")({
  width: "100%",
  height: "20vh",
  display: "flex",
});

const Migrate = () => {
  const [step, setStep] = useState<Steps>(Steps.UsernamePassword);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { intl } = useLocales();

  const migrate = async ({
    oldUsername,
    newUsername,
    password,
  }: {
    oldUsername: string;
    newUsername: string;
    password: string;
  }) => {
    let address: string | null = null;

    try {
      setStep(Steps.Loading);

      await axios.post(
        `${process.env.REACT_APP_FAIROS_URL}/v1/user/login`,
        {
          user_name: oldUsername,
          password,
        },
        { withCredentials: true }
      );

      const { data } = await axios.post(
        `${process.env.REACT_APP_FAIROS_URL}/v1/user/export`,
        {},
        { withCredentials: true }
      );

      address = data?.address;

      await axios.post(
        `${process.env.REACT_APP_FAIROS_URL}/v2/user/migrate`,
        {
          user_name: newUsername,
          password,
        },
        { withCredentials: true }
      );

      setStep(Steps.Complete);
    } catch (error) {
      console.error(error);
      const message = (error as any)?.response?.data?.message;

      if (message?.includes("invalid password")) {
        setErrorMessage(intl.get("INVALID_PASSWORD"));
      } else if (message?.includes("insufficient funds")) {
        setErrorMessage(intl.get("MIGRATION_ERROR_NO_FUNDS") + address);
      } else if (message) {
        setErrorMessage(intl.get("MIGRATION_ERROR") + message);
      }
      setStep(Steps.Error);
    }
  };

  const getStepInstructionMessage = (step: Steps): string => {
    let message: string | null = null;

    if (step === Steps.UsernamePassword) {
      message = "MIGRATE_ACCOUNT_INSTRUCTIONS";
    } else if (step === Steps.Complete) {
      message = "MIGRATION_COMPLETE";
    }

    return message ? intl.get(message) : "";
  };

  const reset = () => {
    setErrorMessage(null);
    setStep(Steps.UsernamePassword);
  };

  return (
    <Wrapper>
      <Title>{intl.get("MIGRATE_ACCOUNT")}</Title>
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
          <MigrateForm onSubmit={migrate} />
          <FlexDiv>
            <Link to={RouteCodes.register}>
              {intl.get("REGISTRATION_LINK")}
            </Link>
          </FlexDiv>
        </>
      )}
      {step === Steps.Complete && (
        <FlexColumnDiv>
          <DoneAll sx={{ margin: "auto" }} data-testid="complete" />
        </FlexColumnDiv>
      )}
      {step === Steps.Loading && (
        <LoaderWrapperDiv>
          <CircularProgress sx={{ margin: "auto" }} />
        </LoaderWrapperDiv>
      )}
      {step === Steps.Error && (
        <LoaderWrapperDiv sx={{ flexDirection: "column" }}>
          <ErrorMessage>
            {errorMessage || intl.get("REGISTRATION_ERROR")}
          </ErrorMessage>
          <Button onClick={reset} sx={{ marginTop: "20px" }}>
            {intl.get("TRY_AGAIN")}
          </Button>
        </LoaderWrapperDiv>
      )}
    </Wrapper>
  );
};

export default Migrate;
