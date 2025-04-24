import { createContext, useState, useEffect } from "react";
import { loadProperties } from "./i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState("es");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    loadProperties(currentLang).then((props) => setTranslations(props));
  }, [currentLang]);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
