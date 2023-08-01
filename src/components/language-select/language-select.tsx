import React from "react";
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

const LanguageSelect = ({ sx }: LanguageSelectProps) => {
  const { intl, currentLocale, languageCodes, getFlagCode, setCurrentLocale } =
    useLocales();
  return (
    <FormControl sx={sx}>
      <InputLabel>{intl.get("LANGUAGE")}</InputLabel>
      <Select
        value={currentLocale}
        size="small"
        label={intl.get("LANGUAGE")}
        onChange={(event) => setCurrentLocale(event.target.value)}
      >
        {languageCodes.map((languageCode) => (
          <MenuItem value={languageCode} key={languageCode}>
            {getFlagCode(languageCode)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
