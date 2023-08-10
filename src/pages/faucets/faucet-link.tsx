import { Avatar, Paper, Stack, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";

export interface FaucetLinkProps {
  name: string;
  href: string;
}

const Link = styled("a")(({ theme }) => ({
  textDecoration: "none",
}));

const FaucetLink = ({ name, href }: FaucetLinkProps) => {
  const theme = useTheme();

  return (
    <Link href={href} target="_blank" rel="noreferrer">
      <Paper
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
          padding: theme.spacing(1),
          textAlign: "center",
          color: theme.palette.text.secondary,
          maxWidth: 400,
          my: 1,
          mx: "auto",
          p: 2,
          overflow: "hidden",
          "&:hover": {
            backgroundColor: theme.palette.border.main,
          },
        }}
      >
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar>{name[0]}</Avatar>
          <Stack spacing={1} direction="column">
            <Typography noWrap align="left">
              {name}
            </Typography>
            <Typography noWrap variant="caption">
              {href}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Link>
  );
};

export default FaucetLink;
