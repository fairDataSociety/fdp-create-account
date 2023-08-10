import React from "react";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
import { useLocales } from "../../context/locales.context";

export interface DisclaimerProps {}

const Box = styled("div")(({ theme }) => ({
  padding: "10px",
  margin: "10px",
  border: `2px solid ${theme.palette.border.main}`,
}));

const Disclaimer = () => {
  const { intl } = useLocales();

  return (
    <Box>
      <Typography>{intl.get("DISCLAIMER")}</Typography>
    </Box>
  );
};

export default Disclaimer;
