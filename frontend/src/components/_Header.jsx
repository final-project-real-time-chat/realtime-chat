import React, { useState, useEffect } from "react";
import { fetchUserLanguage, updateUserLanguage } from "../utils/api.js";

export const Header = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const userLanguage = await fetchUserLanguage();
        setLanguage(userLanguage);
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadLanguage();
  }, []);

  const switchLanguage = async (lang) => {
    try {
      await updateUserLanguage(lang);
      setLanguage(lang);
    } catch (error) {
      console.error("Error switching language:", error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-700 text-white">
      <h1 className="text-xl">Realtime Chat</h1>
      <div>
        <button
          onClick={() => switchLanguage("en")}
          className={`px-4 py-2 rounded-lg mr-2 ${language === "en" ? "bg-blue-700" : "bg-blue-500"}`}
        >
          EN
        </button>
        <button
          onClick={() => switchLanguage("de")}
          className={`px-4 py-2 rounded-lg ${language === "de" ? "bg-blue-700" : "bg-blue-500"}`}
        >
          DE
        </button>
      </div>
    </header>
  );
};
