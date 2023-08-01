import React, { useState } from "react";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { useLocales } from "../../context/locales.context";

export interface ClipboardButtonProps {
  text: string;
}

const ClipboardButton = ({ text }: ClipboardButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [closeTimeoutHandle, setCloseTimeoutHandle] =
    useState<NodeJS.Timeout | null>(null);
  const { intl } = useLocales();

  const onClick = () => {
    navigator.clipboard.writeText(text);
    openSnackbar();
  };

  const openSnackbar = () => {
    if (closeTimeoutHandle) {
      clearTimeout(closeTimeoutHandle);
    }
    setOpen(true);
    setCloseTimeoutHandle(setTimeout(onClose, 3000));
  };

  const onClose = () => {
    if (closeTimeoutHandle) {
      clearTimeout(closeTimeoutHandle);
    }
    setOpen(false);
    setCloseTimeoutHandle(null);
  };

  return (
    <>
      <IconButton aria-label="delete" size="large" onClick={onClick}>
        <ContentCopy />
      </IconButton>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        onClose={onClose}
        message={intl.get("COPY_TO_CLIPBOARD_MESSAGE")}
      />
    </>
  );
};

export default ClipboardButton;
