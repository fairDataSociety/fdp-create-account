import React from "react";
import { styled } from "@mui/system";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from "@mui/material";
import { useLocales } from "../../context/locales.context";
import { Theme } from "@emotion/react";

interface LanguageSelectProps {
  sx?: SxProps<Theme>;
}

const FlagImage = styled("img")({
  width: "30px",
  margin: "auto",
  border: "1px solid #ccc",
});

const LanguageSelect = ({ sx }: LanguageSelectProps) => {
  const { intl, currentLocale, languageCodes, getFlagImage, setCurrentLocale } =
    useLocales();
  return (
    <FormControl sx={sx}>
      <InputLabel>{intl.get("LANGUAGE")}</InputLabel>
      <Select
        value={currentLocale}
        size="small"
        label={intl.get("LANGUAGE")}
        onChange={(event) => setCurrentLocale(event.target.value)}
        sx={{
          minWidth: "80px",
          "& .MuiInputBase-input": {
            display: "flex",
          },
        }}
      >
        {languageCodes.map((languageCode) => (
          <MenuItem
            value={languageCode}
            key={languageCode}
            sx={{ justifyContent: "center" }}
          >
            <FlagImage src={getFlagImage(languageCode)} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
