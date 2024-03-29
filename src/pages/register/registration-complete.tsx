import React from "react";
import DoneAll from "@mui/icons-material/DoneAll";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import AttachMoney from "@mui/icons-material/AttachMoney";
import { FlexColumnDiv } from "../../components/utils/utils";
import {
  Avatar,
  List,
  ListItem as MuiListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useLocales } from "../../context/locales.context";

export interface RegistrationCompleteProps {
  username: string;
  account?: string;
  balance?: string;
}

const ListItem = ({
  avatar,
  primary,
  secondary,
}: {
  avatar: JSX.Element;
  primary: string;
  secondary: string;
}) => (
  <MuiListItem>
    <ListItemAvatar>
      <Avatar>{avatar}</Avatar>
    </ListItemAvatar>
    <ListItemText primary={primary} secondary={secondary} />
  </MuiListItem>
);

const RegistrationComplete = ({
  username,
  account,
  balance,
}: RegistrationCompleteProps) => {
  const { intl } = useLocales();

  return (
    <FlexColumnDiv>
      <DoneAll sx={{ margin: "auto" }} data-testid="complete" />
      <List sx={{ marginTop: "50px" }}>
        <ListItem
          avatar={<AccountCircle />}
          primary={username}
          secondary={intl.get("USERNAME")}
        />
        {account && (
          <ListItem
            avatar={<AccountBalanceWallet />}
            primary={account}
            secondary={intl.get("ADDRESS")}
          />
        )}
        {balance && (
          <ListItem
            avatar={<AttachMoney />}
            primary={balance}
            secondary={intl.get("BALANCE")}
          />
        )}
      </List>
      <Typography
        variant="body1"
        align="center"
        sx={{
          marginTop: "20px",
        }}
      >
        {intl.get("HOW_TO_USE_ACCOUNT_1")}
        <a
          href={process.env.REACT_APP_FAIRDRIVE_URL}
          target="_blank"
          rel="noreferrer"
        >
          Fairdrive
        </a>
        {intl.get("HOW_TO_USE_ACCOUNT_2")}
      </Typography>
    </FlexColumnDiv>
  );
};

export default RegistrationComplete;
