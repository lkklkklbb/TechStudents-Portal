import { useState, useEffect } from "react";
import { translations } from "@/lib/translations";
import { queryClient } from "@/lib/queryClient";

type Language = "en" | "ar";
type TranslationKey = keyof typeof translations.en;

export const useLanguage = () => {
  const [currentLang, setCurrentLang] = useState<Language>(
    (localStorage.getItem("lang") as Language) || "en"
  );
  const [isRtl, setIsRtl] = useState<boolean>(currentLang === "ar");

  const setLanguage = (lang: Language) => {
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
    setIsRtl(lang === "ar");
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    
    // إعادة تحميل الصفحة لتطبيق التغييرات على جميع المكونات
    window.location.reload();
  };

  useEffect(() => {
    // Set initial direction based on stored language
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const translation = translations[currentLang][key] || key;
    
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(`{${paramKey}}`, String(paramValue));
      }, translation);
    }
    
    return translation;
  };

  return {
    currentLang,
    isRtl,
    setLanguage,
    t,
    language: currentLang, // Add language property for direct access
  };
};
