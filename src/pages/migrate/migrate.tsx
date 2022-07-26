import React, { useEffect, useState } from "react";
import intl from "react-intl-universal";
import { styled } from "@mui/system";
import { Button, CircularProgress, Typography } from "@mui/material";
import DoneAll from "@mui/icons-material/DoneAll";
import MigrateForm from "./migrate-form";
import Wrapper from "../../components/wrapper/wrapper.component";
import Title from "../../components/title/title.component";
import Link from "../../components/link/link";
import RouteCodes from "../../routes/route-codes";
import { FlexColumnDiv, FlexDiv } from "../../components/utils/utils";
import ErrorMessage from "../../components/error-message/error-message.component";
import { MigrateData } from "../../model/internal-messages.model";
import { useFdpStorage } from "../../context/fdp.context";
import EnterMnemonic from "../register/enter-mnemonic";
import { Mnemonic } from "../../model/general.types";

enum Steps {
  UsernamePassword,
  EnterMnemonic,
  Complete,
  Loading,
  Error,
}

const LoaderWrapperDiv = styled("div")({
  width: "100%",
  height: "20vh",
  display: "flex",
});

interface MigrationState extends MigrateData {
  mnemonic: Mnemonic;
}

const emptyState: MigrationState = {
  oldUsername: "",
  newUsername: "",
  password: "",
  mnemonic: "",
};

const Migrate = () => {
  const { fdpClient } = useFdpStorage();
  const [step, setStep] = useState<Steps>(Steps.UsernamePassword);
  const [data, setData] = useState<MigrationState>(emptyState);

  const migrate = async () => {
    try {
      const { oldUsername, password, mnemonic } = data;

      await fdpClient.account.migrate(oldUsername, password, { mnemonic });

      setStep(Steps.Complete);
    } catch (error) {
      console.error(error);
      setStep(Steps.Error);
    }
  };

  const onUsernamePasswordSubmit = (migrateData: MigrateData) => {
    setData({
      ...data,
      ...migrateData,
    });
    setStep(Steps.EnterMnemonic);
  };

  const onMnemonicEntered = (mnemonic: string) => {
    setData({
      ...data,
      mnemonic,
    });
  };

  const getStepInstructionMessage = (step: Steps): string => {
    let message: string | null = null;

    if (step === Steps.UsernamePassword) {
      message = "MIGRATE_ACCOUNT_INSTRUCTIONS";
    } else if (step === Steps.EnterMnemonic) {
      message = "EXISTING_ACCOUNT_INSTRUCTIONS";
    } else if (step === Steps.Complete) {
      message = "REGISTRATION_COMPLETE";
    }

    return message ? intl.get(message) : "";
  };

  const reset = () => {
    setData(emptyState);
    setStep(Steps.UsernamePassword);
  };

  useEffect(() => {
    if (data.mnemonic && step === Steps.EnterMnemonic) {
      setStep(Steps.Loading);
      migrate();
    }
  }, [data.mnemonic]);

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
          <MigrateForm onSubmit={onUsernamePasswordSubmit} />
          <FlexDiv>
            <Link to={RouteCodes.register}>
              {intl.get("REGISTRATION_LINK")}
            </Link>
          </FlexDiv>
        </>
      )}
      {step === Steps.EnterMnemonic && (
        <EnterMnemonic onSubmit={onMnemonicEntered} />
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
          <ErrorMessage>{intl.get("REGISTRATION_ERROR")}</ErrorMessage>
          <Button onClick={reset} sx={{ marginTop: "20px" }}>
            {intl.get("TRY_AGAIN")}
          </Button>
        </LoaderWrapperDiv>
      )}
    </Wrapper>
  );
};

export default Migrate;
