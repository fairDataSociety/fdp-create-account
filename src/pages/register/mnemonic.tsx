import React, { useMemo } from "react";
import { styled } from "@mui/system";
import { Button, Chip, Typography } from "@mui/material";
import { FlexColumnDiv, FlexDiv } from "../../components/utils/utils";
import { Mnemonic } from "../../model/general.types";
import ClipboardButton from "../../components/clipboard-button/clipboard-button.component";
import { useLocales } from "../../context/locales.context";

export interface MnemonicProps {
  phrase: Mnemonic;
  onConfirm: () => void;
}

const ContainerDiv = styled("div")({
  display: "flex",
  flexDirection: "column",
  margin: "20px auto 0 auto",
});

const NonSelectableDiv = styled("div")({
  userSelect: "none",
  display: "inline",
});

const MnemonicComponent = ({ phrase, onConfirm }: MnemonicProps) => {
  const words = useMemo(() => phrase.split(" "), [phrase]);
  const { intl } = useLocales();

  return (
    <FlexColumnDiv>
      <FlexDiv>
        <ContainerDiv data-testid="mnemonic">
          {words.map((word, index) => (
            <Typography variant="h6" key={index} sx={{ margin: "4px 0" }}>
              <NonSelectableDiv>{index + 1}.</NonSelectableDiv>
              <Chip label={word} sx={{ fontSize: "18px" }} />
            </Typography>
          ))}
        </ContainerDiv>
      </FlexDiv>
      <FlexDiv sx={{ width: "50px", margin: "auto" }}>
        <ClipboardButton text={phrase} />
      </FlexDiv>
      <Button
        onClick={onConfirm}
        color="primary"
        variant="contained"
        size="large"
        data-testid="submit"
        sx={{
          padding: "10px 50px",
          margin: "50px auto 0 auto",
        }}
      >
        {intl.get("OK")}
      </Button>
    </FlexColumnDiv>
  );
};

export default MnemonicComponent;
