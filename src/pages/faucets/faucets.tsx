import { Box, Typography } from "@mui/material";
import Title from "../../components/title/title.component";
import { sepoliaFaucets } from "../../constants/faucets";
import FaucetLink from "./faucet-link";
import { useLocales } from "../../context/locales.context";

const Faucets = () => {
  const { intl } = useLocales();

  return (
    <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3 }}>
      <Title>{intl.get("SEPOLIA_FAUCETS")}</Title>
      <Typography
        variant="body1"
        align="center"
        sx={{
          marginTop: "20px",
        }}
      >
        {intl.get("FAUCETS_INSTRUCTIONS")}
      </Typography>
      {sepoliaFaucets.map(({ name, href }) => (
        <FaucetLink key={name} name={name} href={href} />
      ))}
    </Box>
  );
};

export default Faucets;
