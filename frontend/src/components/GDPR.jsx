export const GDPR = () => {
  return (
    <div className="flex flex-col items-center text-white">
      <div className="xl:w-[50%] w-[90%]">
        <header>
          <h1 className="text-3xl font-semibold mb-8 underline text-center">
            General Data Protection Regulation
          </h1>
        </header>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Verantwortliche Stelle
          </h2>
          <p>
            Diese Real-Time-Chat-App ist ein Ausbildungsprojekt, das zu
            Lernzwecken entwickelt wurde. Verantwortlich für die
            Datenverarbeitung im Rahmen dieser App sind die Entwickler*innen des
            Ausbildungsprojekts.
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
            <li>🖼️ Hochgeladene Bilder</li>
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
            4. Unverschlüsselte Übertragung
          </h2>
          <p className="">
            Bitte beachten Sie, dass alle Nachrichten und Bilder{" "}
            <strong>unverschlüsselt</strong> übertragen und gespeichert werden.
            Dadurch besteht das Risiko, dass Dritte auf die übermittelten
            Inhalte zugreifen können. Wir empfehlen,{" "}
            <strong>keine sensiblen oder vertraulichen Informationen</strong>{" "}
            über diese App zu teilen.
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
            <li>📄 Auskunft über die gespeicherten personenbezogenen Daten</li>
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
          <h2 className="text-2xl font-semibold mb-4">6. Haftungsausschluss</h2>
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
            können Sie uns über die auf der <strong>"About Us"</strong>-Seite
            angegebenen Kontaktmöglichkeiten erreichen.
          </p>
        </section>

        <footer className="text-center mt-8">
          <p>
            <strong>Stand:</strong> März 2025
          </p>
        </footer>
      </div>
    </div>
  );
};
