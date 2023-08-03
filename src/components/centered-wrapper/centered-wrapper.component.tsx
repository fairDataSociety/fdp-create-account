import React from "react";
import { styled } from "@mui/system";
import { Web3Button } from "@web3modal/react";
import LanguageSelect from "../language-select/language-select";

export interface CenteredWrapperProps {
  children: React.ReactNode;
}

const WrapperDiv = styled("div")({
  width: "100%",
  display: "flex",
  position: "relative",
});

const InnerDiv = styled("div")(({ theme }) => ({
  display: "flex",
  margin: "auto",
  minWidth: "500px",
  [theme.breakpoints.down("sm")]: {
    minWidth: "100%",
  },
}));

const CenteredWrapper = ({ children }: CenteredWrapperProps) => {
  return (
    <>
      <WrapperDiv>
        <LanguageSelect sx={{ position: "absolute", top: 5, right: 5 }} />
        <div style={{ position: "absolute", top: 5, right: "100px" }}>
          <Web3Button />
        </div>

        <InnerDiv>{children}</InnerDiv>
      </WrapperDiv>
    </>
  );
};

export default CenteredWrapper;
