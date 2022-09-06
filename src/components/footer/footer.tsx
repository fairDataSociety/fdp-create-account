import React from "react";
import { styled } from "@mui/system";
import { Grid, Link as MuiLink, Typography } from "@mui/material";
import fdsLogo from "../../assets/images/FDS_logo_transparent.png";
import swarmLogo from "../../assets/images/swarm-logo-2.svg";

const Wrapper = styled("div")(({ theme }) => ({
  width: "100%",
  marginTop: "auto",
  paddingTop: "50px",
}));

const InnerWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  padding: "20px 40px",
  backgroundColor: theme.palette.footer.main,
  boxShadow: "inset 0px 7px 10px 0px rgba(25,117,210,0.24)",
}));

const Logo = styled("img")(() => ({
  width: "30px",
}));

const Column = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > *": {
    marginBottom: "10px !important",
  },
}));

const Link = ({
  href,
  children,
}: {
  href: string;
  children: JSX.Element | string;
}) => (
  <MuiLink href={href} underline="hover" color="primary" target="_blank">
    {children}
  </MuiLink>
);

const Footer = () => {
  return (
    <Wrapper>
      <InnerWrapper>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3} alignContent="center">
            <Column>
              <Typography variant="h6">ABOUT</Typography>
              <Link href="https://fairdatasociety.org/">
                <Logo src={fdsLogo} sx={{ width: "50px" }} />
              </Link>
              <Link href="https://www.ethswarm.org/">
                <Logo src={swarmLogo} />
              </Link>
              <Link href="https://github.com/fairDataSociety/fdp-create-account">
                <>
                  {process.env.REACT_APP_VERSION}{" "}
                  {process.env.REACT_APP_BLOCKCHAIN_INFO}
                </>
              </Link>
            </Column>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Column>
              <Typography variant="h6">COMMUNITY</Typography>
              <Link href="http://portal.fairdatasociety.org/">Ecosystem</Link>
              <Link href="https://twitter.com/fairdatasociety">Twitter</Link>
              <Link href="https://discord.com/channels/888359049551310869/940628803250704394">
                Discord
              </Link>
            </Column>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Column>
              <Typography variant="h6">RESOURCES</Typography>
              <Link href="https://github.com/fairDataSociety/fdp-create-account">
                Documentation
              </Link>
              <Link href="https://github.com/fairDataSociety/fdp-create-account">
                Github
              </Link>
              <Link href="https://github.com/fairDataSociety/fdp-create-account">
                Blog
              </Link>
            </Column>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Column>
              <Typography variant="h6">EXTENSIONS</Typography>
              <Link href="https://chrome.google.com/webstore/detail/blossom/caedjloenbhibmaeffockkiallpngmmd">
                Blossom
              </Link>
              <Link href="https://chrome.google.com/webstore/detail/ethereum-swarm-extension/afpgelfcknfbbfnipnomfdbbnbbemnia">
                Swarm
              </Link>
            </Column>
          </Grid>
        </Grid>
      </InnerWrapper>
    </Wrapper>
  );
};

export default Footer;
