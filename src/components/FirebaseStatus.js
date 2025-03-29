// src/components/FirebaseStatus.js
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const FirebaseStatus = () => {
  const { firebaseStatus, error } = useAppContext();
  const [showDetails, setShowDetails] = useState(false);

  if (firebaseStatus?.initialized && !error) {
    return null; // Alles in Ordnung, nichts anzeigen
  }

  return (
    <div className="max-w-3xl mx-auto my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Firebase-Konfigurationsproblem
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              {!firebaseStatus?.initialized ? 
                "Die Verbindung zu Firebase konnte nicht hergestellt werden. Die App läuft im Demo-Modus." : 
                `Fehler: ${error}`}
            </p>
            
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="mt-2 text-sm text-yellow-800 underline focus:outline-none"
            >
              {showDetails ? "Details ausblenden" : "Details anzeigen"}
            </button>
            
            {showDetails && (
              <div className="mt-3 p-3 bg-yellow-100 rounded-md border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Für die Konfiguration von Firebase:</h4>
                <ol className="list-decimal pl-5 text-xs text-yellow-800">
                  <li className="mb-1">
                    Erstelle eine <code>.env</code> Datei im Hauptverzeichnis des Projekts
                  </li>
                  <li className="mb-1">
                    Füge folgende Umgebungsvariablen hinzu (Werte aus deinem Firebase-Projekt abrufen):
                    <pre className="my-2 p-2 bg-yellow-50 rounded text-xs overflow-x-auto">
                      REACT_APP_FIREBASE_API_KEY=dein_api_key<br />
                      REACT_APP_FIREBASE_AUTH_DOMAIN=dein_projekt.firebaseapp.com<br />
                      REACT_APP_FIREBASE_PROJECT_ID=dein_projekt<br />
                      REACT_APP_FIREBASE_STORAGE_BUCKET=dein_projekt.appspot.com<br />
                      REACT_APP_FIREBASE_MESSAGING_SENDER_ID=deine_sender_id<br />
                      REACT_APP_FIREBASE_APP_ID=deine_app_id
                    </pre>
                  </li>
                  <li className="mb-1">
                    Alternativ kannst du die Konfiguration direkt in <code>AppContext.js</code> eintragen
                  </li>
                  <li className="mb-1">
                    Starte die Anwendung neu nach der Konfiguration
                  </li>
                </ol>
                <p className="mt-2 text-xs text-yellow-800">
                  Im aktuellen Demo-Modus werden Änderungen nicht in einer Datenbank gespeichert.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseStatus;