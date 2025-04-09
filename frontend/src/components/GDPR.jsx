import { useState, useEffect } from "react";
import { fetchUserLanguage } from "../utils/api.js";
import { getTranslations } from "../utils/languageHelper.js";
import { fetchBrowserLanguage } from "../utils/browserLanguage.js";

export const GDPR = () => {
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const userData = await fetchUserLanguage();
        const userLanguage = userData?.language || fetchBrowserLanguage();
        setTranslations(getTranslations(userLanguage));
      } catch (error) {
        console.error("Failed to fetch user language:", error);
        const browserLanguage = fetchBrowserLanguage();
        setTranslations(getTranslations(browserLanguage));
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  if (loading) {
    return <p className="text-white text-center">{translations.loading}</p>;
  }

  return (
    <div className="flex flex-col items-center text-white">
      <div className="xl:w-[50%] w-[90%]">
        <header>
          <h1 className="text-3xl font-semibold mb-8 underline text-center">
            {translations.gdprHeader}
          </h1>
        </header>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {translations.gdprDataController}
          </h2>
          <p>{translations.gdprDataControllerDescription}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {translations.gdprDataTypes}
          </h2>
          <p className="mb-4">{translations.gdprDataTypesDescription}</p>
          <ul className="list-disc list-inside space-y-2">
            {translations.gdprDataTypesList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {translations.gdprPurpose}
          </h2>
          <p>{translations.gdprPurposeDescription}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {translations.gdprSecurity}
          </h2>
          <p>{translations.gdprSecurityDescription}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {translations.gdprUserRights}
          </h2>
          <p className="mb-4">{translations.gdprUserRightsDescription}</p>
          <ul className="list-disc list-inside space-y-2">
            {translations.gdprUserRightsList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {translations.gdprDisclaimer}
          </h2>
          <p>{translations.gdprDisclaimerDescription}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {translations.gdprContact}
          </h2>
          <p>{translations.gdprContactDescription}</p>
        </section>

        <footer className="text-center my-8">
          <p>
            <strong>{translations.gdprLastUpdated}</strong>
          </p>
        </footer>
      </div>
    </div>
  );
};
