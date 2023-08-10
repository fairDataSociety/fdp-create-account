import React, { useMemo, useState } from "react";
import { createContext, useContext } from "react";
import intl from "react-intl-universal";
import chChLocales from "../assets/locales/ch-CH.json";
import deDeLocales from "../assets/locales/de-DE.json";
import enUsLocales from "../assets/locales/en-US.json";
import esEsLocales from "../assets/locales/es-ES.json";
import frFrLocales from "../assets/locales/fr-FR.json";
import huHuLocales from "../assets/locales/hu-HU.json";
import itItLocales from "../assets/locales/it-IT.json";
import jpJpLocales from "../assets/locales/jp-JP.json";
import ptPtLocales from "../assets/locales/pt-PT.json";
import rsRsLocales from "../assets/locales/rs-RS.json";
import slSlLocales from "../assets/locales/sl-SI.json";
import trTrLocales from "../assets/locales/tr-TR.json";

import cnFlag from "../assets/images/flags/cn.svg";
import deFlag from "../assets/images/flags/de.svg";
import enFlag from "../assets/images/flags/gb.svg";
import esFlag from "../assets/images/flags/es.svg";
import frFlag from "../assets/images/flags/fr.svg";
import huFlag from "../assets/images/flags/hu.svg";
import itFlag from "../assets/images/flags/it.svg";
import jpFlag from "../assets/images/flags/jp.svg";
import ptFlag from "../assets/images/flags/pt.svg";
import rsFlag from "../assets/images/flags/rs.svg";
import slFlag from "../assets/images/flags/si.svg";
import trFlag from "../assets/images/flags/tr.svg";

const LOCAL_STORAGE_LOCALES_KEY = "lang";

const flagMap: Record<string, string> = {
  "ch-CH": cnFlag,
  "de-DE": deFlag,
  "en-US": enFlag,
  "es-ES": esFlag,
  "fr-FR": frFlag,
  "hu-HU": huFlag,
  "it-IT": itFlag,
  "jp-JP": jpFlag,
  "pt-PT": ptFlag,
  "rs-RS": rsFlag,
  "sl-SI": slFlag,
  "tr-TR": trFlag,
};

export interface ILocalesContext {
  intl: typeof intl;
  currentLocale: string;
  languageCodes: string[];
  getFlagImage: (language?: string) => string;
  setCurrentLocale: (locale: string) => void;
}

const LocalesContext = createContext<ILocalesContext>({
  intl,
  currentLocale: "en-US",
  languageCodes: [],
  getFlagImage: () => "",
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
      "hu-HU": huHuLocales,
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

  const getFlagImage = (language?: string) =>
    flagMap[language || currentLocale];

  return (
    <LocalesContext.Provider
      value={{
        intl,
        currentLocale,
        languageCodes,
        getFlagImage,
        setCurrentLocale: changeCurrentLocale,
      }}
    >
      {children}
    </LocalesContext.Provider>
  );
};
