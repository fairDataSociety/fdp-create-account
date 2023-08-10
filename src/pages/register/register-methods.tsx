import React from "react";
import { styled } from "@mui/system";
import { Button } from "@mui/material";
import { useLocales } from "../../context/locales.context";

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  margin: "50px 50px 0 50px",
  [theme.breakpoints.down("md")]: {
    margin: "50px 0 0 0",
  },
}));

const buttonStyle = {
  padding: "14px 0",
  width: "200px",
  fontSize: "16px",
  fontWeight: "bold",
};

interface RegisterMethodsProps {
  onNewAccountSelect: () => void;
  onExistingAccountSelect: () => void;
}

const RegisterMethods = ({
  onNewAccountSelect,
  onExistingAccountSelect,
}: RegisterMethodsProps) => {
  const { intl } = useLocales();

  return (
    <Wrapper>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{
          ...buttonStyle,
          width: {
            sm: "200px",
            xs: "100%",
          },
        }}
        onClick={onNewAccountSelect}
        data-testid="register-new"
      >
        {intl.get("NEW_ADDRESS")}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{
          ...buttonStyle,
          width: {
            sm: "200px",
            xs: "100%",
          },
          marginLeft: {
            sm: "auto",
            xs: 0,
          },
          marginTop: {
            sm: 0,
            xs: "20px",
          },
        }}
        onClick={onExistingAccountSelect}
        data-testid="existing-account"
      >
        {intl.get("EXISTING_ADDRESS")}
      </Button>
    </Wrapper>
  );
};

export default RegisterMethods;
