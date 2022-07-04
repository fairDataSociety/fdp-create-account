import React from "react";
import { createContext, useContext, useEffect } from "react";
import intl from "react-intl-universal";
import enUsLocales from "../assets/locales/en-US.json";

const LocalesContext = createContext<null>(null);

export const useLocalesContext = () => useContext(LocalesContext);

export interface LocalesContextProviderProps {
  children: React.ReactNode;
}

function setLanguage(language: string) {
  intl.init({
    currentLocale: language,
    locales: {
      [language]: enUsLocales,
    },
  });
}

setLanguage("en-US");

export const LocalesContextProvider = ({
  children,
}: LocalesContextProviderProps) => {
  // TODO Should provide a function to change language

  useEffect(() => {
    setLanguage("en-US");
  }, []);

  return (
    <LocalesContext.Provider value={null}>{children}</LocalesContext.Provider>
  );
};
