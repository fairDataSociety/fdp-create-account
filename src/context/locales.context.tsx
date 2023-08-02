import React, { useMemo, useState } from "react";
import { createContext, useContext } from "react";
import intl from "react-intl-universal";
import chChLocales from "../assets/locales/ch-CH.json";
import deDeLocales from "../assets/locales/de-DE.json";
import enUsLocales from "../assets/locales/en-US.json";
import esEsLocales from "../assets/locales/es-ES.json";
import frFrLocales from "../assets/locales/fr-FR.json";
import itItLocales from "../assets/locales/it-IT.json";
import jpJpLocales from "../assets/locales/jp-JP.json";
import ptPtLocales from "../assets/locales/pt-PT.json";
import rsRsLocales from "../assets/locales/rs-RS.json";
import slSlLocales from "../assets/locales/sl-SI.json";
import trTrLocales from "../assets/locales/tr-TR.json";

const LOCAL_STORAGE_LOCALES_KEY = "lang";

const flagMap: Record<string, string> = {
  "ch-CH": "🇨🇳",
  "de-DE": "🇩🇪",
  "en-US": "🇬🇧",
  "es-ES": "🇪🇸",
  "fr-FR": "🇫🇷",
  "it-IT": "🇮🇹",
  "jp-JP": "🇯🇵",
  "pt-PT": "🇵🇹",
  "rs-RS": "🇷🇸",
  "sl-SI": "🇸🇮",
  "tr-TR": "🇹🇷",
};

export interface ILocalesContext {
  intl: typeof intl;
  currentLocale: string;
  languageCodes: string[];
  getFlagCode: (language?: string) => string;
  setCurrentLocale: (locale: string) => void;
}

const LocalesContext = createContext<ILocalesContext>({
  intl,
  currentLocale: "en-US",
  languageCodes: [],
  getFlagCode: () => "",
  setCurrentLocale: () => {},
});

export const useLocales = () => useContext(LocalesContext);

export interface LocalesContextProviderProps {
  children: React.ReactNode;
}

const defaultLanguage =
  localStorage.getItem(LOCAL_STORAGE_LOCALES_KEY) || "en-US";

function setLanguage(language: string) {
  localStorage.setItem(LOCAL_STORAGE_LOCALES_KEY, language);

  intl.init({
    currentLocale: language,
    locales: {
      "ch-CH": chChLocales,
      "de-DE": deDeLocales,
      "en-US": enUsLocales,
      "es-ES": esEsLocales,
      "fr-FR": frFrLocales,
      "it-IT": itItLocales,
      "jp-JP": jpJpLocales,
      "pt-PT": ptPtLocales,
      "rs-RS": rsRsLocales,
      "sl-SI": slSlLocales,
      "tr-TR": trTrLocales,
    },
  });
}

setLanguage(defaultLanguage);

export const LocalesContextProvider = ({
  children,
}: LocalesContextProviderProps) => {
  const [currentLocale, setCurrentLocale] = useState<string>(defaultLanguage);

  const languageCodes = useMemo(() => Object.keys(flagMap), []);

  const changeCurrentLocale = (locale: string) => {
    setLanguage(locale);

    setCurrentLocale(locale);
  };

  const getFlagCode = (language?: string) => flagMap[language || currentLocale];

  return (
    <LocalesContext.Provider
      value={{
        intl,
        currentLocale,
        languageCodes,
        getFlagCode,
        setCurrentLocale: changeCurrentLocale,
      }}
    >
      {children}
    </LocalesContext.Provider>
  );
};
