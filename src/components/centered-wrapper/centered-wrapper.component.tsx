import React from "react";
import { styled } from "@mui/system";
import { Web3Button } from "@web3modal/react";

export interface CenteredWrapperProps {
  children: React.ReactNode;
}

const WrapperDiv = styled("div")({
  width: "100%",
  display: "flex",
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
        <div style={{ position: 'absolute', right: '10px' }}>
          <Web3Button />
        </div>

        <InnerDiv>{children}</InnerDiv>
      </WrapperDiv>
    </>
  )
};

export default CenteredWrapper;
