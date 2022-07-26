import React from "react";
import { Link as RouterLink, To } from "react-router-dom";
import { Link as MuiLink, Theme } from "@mui/material";

interface LinkProps {
  to: To;
  children: React.ReactNode;
}

const Link = ({ to, children }: LinkProps) => {
  return (
    <MuiLink
      component={RouterLink}
      to={to}
      sx={{
        textDecoration: "none",
        display: "flex",
        flexWrap: "wrap",
        maxWidth: "400px",
        textAlign: "center",
        margin: "auto",
        marginTop: "30px",
        color: (theme: Theme) => theme.palette.link.main,
        "&:hover": {
          color: (theme: Theme) => theme.palette.linkHover.main,
        },
      }}
    >
      {children}
    </MuiLink>
  );
};

export default Link;
