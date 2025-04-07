import { useState, useEffect } from "react";
import { fetchUserLanguage } from "../utils/api.js";

export const GDPR = () => {
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const userData = await fetchUserLanguage();
        setLanguage(userData.language || "en");
      } catch (error) {
        console.error("Failed to fetch user language:", error);
        setLanguage("en");
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (language === "de") {
    return (
      <div className="flex flex-col items-center text-white">
        <div className="xl:w-[50%] w-[90%]">
          <header>
            <h1 className="text-3xl font-semibold mb-8 underline text-center">
              Datenschutzerklärung
            </h1>
          </header>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              1. Verantwortliche Stelle
            </h2>
            <p>
              Diese Real-Time-Chat-App ist ein Ausbildungsprojekt, das zu
              Lernzwecken entwickelt wurde. Verantwortlich für die
              Datenverarbeitung im Rahmen dieser App sind die Entwickler*innen
              des Ausbildungsprojekts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Art der verarbeiteten Daten
            </h2>
            <p className=" mb-4">
              Im Rahmen der Nutzung unserer Chat-App erheben und verarbeiten wir
              folgende personenbezogene Daten:
            </p>
            <ul className="list-disc list-inside space-y-2 ">
              <li>✉️ Nachrichteninhalte (Textnachrichten)</li>
              <li>
                🖼️ Hochgeladene Bilder (werden über Cloudinary gespeichert und
                versendet)
              </li>
              <li>👤 Benutzername oder Anzeigename (falls angegeben)</li>
              <li>🕒 Zeitstempel der Nachrichten</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. Zweck der Datenverarbeitung
            </h2>
            <p>
              Die erhobenen Daten dienen ausschließlich dem Betrieb der
              Chat-Funktion, um die Kommunikation zwischen den Nutzer*innen in
              Echtzeit zu ermöglichen. Es erfolgt <strong>keine</strong>{" "}
              kommerzielle Nutzung oder Weitergabe der Daten an Dritte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Sicherheit und Verschlüsselung
            </h2>
            <p>
              Bitte beachten Sie, dass alle Nachrichten und Bilder{" "}
              <strong>unverschlüsselt</strong> übertragen werden. Dadurch
              besteht das Risiko, dass Dritte auf die übermittelten Inhalte
              zugreifen können. Wir empfehlen,{" "}
              <strong>keine sensiblen oder vertraulichen Informationen</strong>{" "}
              über diese App zu teilen. Passwörter werden jedoch mit{" "}
              <strong>bcrypt</strong> verschlüsselt gespeichert, um die
              Sicherheit der Nutzerkonten zu gewährleisten.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              5. Rechte der Nutzer*innen
            </h2>
            <p className=" mb-4">
              Als Nutzer*in der Chat-App haben Sie folgende Rechte:
            </p>
            <ul className="list-disc list-inside space-y-2 ">
              <li>
                📄 Auskunft über die gespeicherten personenbezogenen Daten
              </li>
              <li>✏️ Berichtigung unrichtiger oder unvollständiger Daten</li>
              <li>🗑️ Löschung Ihrer Daten</li>
              <li>⏸️ Einschränkung der Verarbeitung Ihrer Daten</li>
            </ul>
            <p className=" mt-4">
              Zur Ausübung dieser Rechte können Sie sich jederzeit an die
              Verantwortlichen des Ausbildungsprojekts wenden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              6. Haftungsausschluss
            </h2>
            <p>
              Diese App befindet sich in der <strong>Entwicklungsphase</strong>{" "}
              und wird zu Ausbildungszwecken betrieben. Wir übernehmen{" "}
              <strong>keine Haftung</strong> für mögliche Datenverluste oder
              unbefugten Zugriff auf die übermittelten Inhalte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Kontakt</h2>
            <p>
              Bei Fragen zur Datenverarbeitung oder zur Wahrnehmung Ihrer Rechte
              können Sie uns über die auf der<strong className="underline"> Über uns </strong>Seite
              angegebenen Kontaktmöglichkeiten erreichen.
            </p>
          </section>

          <footer className="text-center my-8">
            <p>
              <strong>Stand:</strong> März 2025
            </p>
          </footer>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center text-white">
        <div className="xl:w-[50%] w-[90%]">
          <header>
            <h1 className="text-3xl font-semibold mb-8 underline text-center">
              General Data Protection Regulation (GDPR)
            </h1>
          </header>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Data Controller</h2>
            <p>
              This real-time chat app is a training project developed for
              educational purposes. The developers of this training project are
              responsible for data processing within this app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Types of Processed Data
            </h2>
            <p className="mb-4">
              When using our chat app, we collect and process the following
              personal data:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>✉️ Message content (text messages)</li>
              <li>🖼️ Uploaded images (stored and sent via Cloudinary)</li>
              <li>👤 Username or display name (if provided)</li>
              <li>🕒 Timestamp of messages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. Purpose of Data Processing
            </h2>
            <p>
              The collected data is used solely for operating the chat function,
              enabling real-time communication between users. There is
              <strong>no</strong> commercial use or transfer of data to third
              parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Security and Encryption
            </h2>
            <p>
              Please note that all messages and images are
              <strong>transmitted and stored unencrypted</strong>. This poses a
              risk that third parties may access transmitted content. We
              recommend
              <strong>
                {" "}
                not sharing sensitive or confidential information
              </strong>{" "}
              via this app. However, passwords are securely stored using{" "}
              <strong>bcrypt</strong> encryption to ensure user account
              security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Rights</h2>
            <p className="mb-4">
              As a user of the chat app, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>📄 Access to stored personal data</li>
              <li>✏️ Correction of incorrect or incomplete data</li>
              <li>🗑️ Deletion of your data</li>
              <li>⏸️ Restriction of data processing</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, you can contact the responsible
              developers of the training project at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
            <p>
              This app is in the <strong>development phase</strong> and is
              operated for educational purposes. We assume{" "}
              <strong>no liability</strong> for potential data loss or
              unauthorized access to transmitted content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
            <p>
              If you have any questions regarding data processing or wish to
              exercise your rights, you can reach us via the contact information
              provided on the
              <strong className="underline"> About Us </strong>page.
            </p>
          </section>

          <footer className="text-center my-8">
            <p>
              <strong>Last updated:</strong> March 2025
            </p>
          </footer>
        </div>
      </div>
    );
  }
};
