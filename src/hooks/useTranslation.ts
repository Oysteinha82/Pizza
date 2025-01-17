import { en } from "@/translations/en";
import { no } from "@/translations/no";

export type Language = "en" | "no";

const translations = {
  en,
  no,
};

export function useTranslation(language: Language) {
  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }

    return value || key;
  };

  return { t };
}
