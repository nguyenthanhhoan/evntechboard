// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import vi from "./locales/vi.json";

const resources = {
    en,
    es,
    fr,
    vi,
};

i18n
    .use(initReactI18next)
    .init({
        resources, // Use the imported language files
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    })
    .then(() => console.log("i18n initialized successfully"))
    .catch((err) => console.error("i18n initialization failed:", err));

export default i18n;