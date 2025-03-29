// src/context/AppContext.js - überarbeitete Version
import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  connectFirestoreEmulator  // Für lokale Entwicklung
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  connectAuthEmulator  // Für lokale Entwicklung
} from 'firebase/auth';

// Firebase Konfiguration - DIREKTE KONFIGURATION FÜR TESTS
// ⚠️ WICHTIG: Diese sollte in der Produktion durch Umgebungsvariablen ersetzt werden!
const firebaseConfig = {

  apiKey: "AIzaSyALKLsfHwBpjxb5S62Q9o8iGH3TcG2bwdU",

  authDomain: "chair-a337a.firebaseapp.com",

  projectId: "chair-a337a",

  storageBucket: "chair-a337a.firebasestorage.app",

  messagingSenderId: "980051818660",

  appId: "1:980051818660:web:6a3c98259ef5b1e7918e31"

};


// Demo-Apps für den Fall, dass Firebase nicht verfügbar ist
const DEMO_APPS = [
  {
    id: "demo1",
    title: "Demo Counter App",
    author: "Demo User",
    tags: ["demo", "counter"],
    createdAt: new Date(),
    code: `
      const app = document.getElementById('app');
      let count = 0;
      
      const container = document.createElement('div');
      container.style.textAlign = 'center';
      container.style.fontFamily = 'Arial, sans-serif';
      
      const heading = document.createElement('h2');
      heading.textContent = 'Simple Counter';
      
      const counter = document.createElement('div');
      counter.textContent = count;
      counter.style.fontSize = '2rem';
      counter.style.margin = '1rem 0';
      
      const buttonContainer = document.createElement('div');
      
      const decrementBtn = document.createElement('button');
      decrementBtn.textContent = '-';
      decrementBtn.style.padding = '0.5rem 1rem';
      decrementBtn.style.margin = '0 0.5rem';
      decrementBtn.addEventListener('click', () => {
        count--;
        counter.textContent = count;
      });
      
      const incrementBtn = document.createElement('button');
      incrementBtn.textContent = '+';
      incrementBtn.style.padding = '0.5rem 1rem';
      incrementBtn.style.margin = '0 0.5rem';
      incrementBtn.addEventListener('click', () => {
        count++;
        counter.textContent = count;
      });
      
      buttonContainer.appendChild(decrementBtn);
      buttonContainer.appendChild(incrementBtn);
      
      container.appendChild(heading);
      container.appendChild(counter);
      container.appendChild(buttonContainer);
      
      app.appendChild(container);
    `
  },
  {
    id: "demo2",
    title: "Text Umwandler",
    author: "Demo User",
    tags: ["demo", "text"],
    createdAt: new Date(),
    code: `
      const app = document.getElementById('app');
      
      const container = document.createElement('div');
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.maxWidth = '500px';
      container.style.margin = '0 auto';
      
      const heading = document.createElement('h2');
      heading.textContent = 'Text Umwandler';
      
      const input = document.createElement('textarea');
      input.placeholder = 'Text hier eingeben...';
      input.style.width = '100%';
      input.style.minHeight = '100px';
      input.style.padding = '0.5rem';
      input.style.marginBottom = '1rem';
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '0.5rem';
      buttonContainer.style.marginBottom = '1rem';
      
      const upperBtn = document.createElement('button');
      upperBtn.textContent = 'GROSS';
      upperBtn.style.padding = '0.5rem';
      upperBtn.style.flex = '1';
      
      const lowerBtn = document.createElement('button');
      lowerBtn.textContent = 'klein';
      lowerBtn.style.padding = '0.5rem';
      lowerBtn.style.flex = '1';
      
      const reverseBtn = document.createElement('button');
      reverseBtn.textContent = 'Umdrehen';
      reverseBtn.style.padding = '0.5rem';
      reverseBtn.style.flex = '1';
      
      const output = document.createElement('div');
      output.style.border = '1px solid #ccc';
      output.style.padding = '1rem';
      output.style.minHeight = '100px';
      output.style.backgroundColor = '#f9f9f9';
      
      upperBtn.addEventListener('click', () => {
        output.textContent = input.value.toUpperCase();
      });
      
      lowerBtn.addEventListener('click', () => {
        output.textContent = input.value.toLowerCase();
      });
      
      reverseBtn.addEventListener('click', () => {
        output.textContent = input.value.split('').reverse().join('');
      });
      
      buttonContainer.appendChild(upperBtn);
      buttonContainer.appendChild(lowerBtn);
      buttonContainer.appendChild(reverseBtn);
      
      container.appendChild(heading);
      container.appendChild(input);
      container.appendChild(buttonContainer);
      container.appendChild(output);
      
      app.appendChild(container);
    `
  }
];

// Firebase initialisieren
let app;
let db;
let auth;
let isFirebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  isFirebaseInitialized = true;
  console.log("Firebase wurde erfolgreich initialisiert");
  
  // Optional: Für die lokale Entwicklung mit Firebase Emulator
  // Auskommentieren, wenn du die Cloud-Version verwenden möchtest
  // if (window.location.hostname === "localhost") {
  //   connectFirestoreEmulator(db, 'localhost', 8080);
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   console.log("Firebase Emulatoren verbunden");
  // }
} catch (error) {
  console.error("Firebase Initialisierungsfehler:", error);
  isFirebaseInitialized = false;
}

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState({
    initialized: isFirebaseInitialized,
    error: isFirebaseInitialized ? null : "Firebase konnte nicht initialisiert werden"
  });

  // Authentifizierung überwachen
  useEffect(() => {
    if (!isFirebaseInitialized) {
      setError("Firebase ist nicht initialisiert. Bitte prüfe die Konfiguration.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("Auth-Status geändert:", user ? "Benutzer angemeldet" : "Nicht angemeldet");
    });

    return () => unsubscribe();
  }, []);

  // Apps von Firebase laden oder Demo-Daten verwenden
  useEffect(() => {
    const loadData = async () => {
      if (isFirebaseInitialized) {
        // Firebase ist verfügbar - lade echte Daten
        try {
          console.log("Versuche Apps zu laden...");
          const q = query(
            collection(db, "apps"),
            orderBy("createdAt", "desc")
          );
          
          const querySnapshot = await getDocs(q);
          const appsData = [];
          
          querySnapshot.forEach((doc) => {
            appsData.push({ 
              id: doc.id, 
              ...doc.data(), 
              createdAt: doc.data().createdAt?.toDate() || new Date() 
            });
          });
          
          console.log(`${appsData.length} Apps geladen`);
          setApps(appsData);
        } catch (err) {
          console.error("Error fetching apps:", err);
          setError(`Fehler beim Laden der Apps: ${err.message}`);
        }
      } else {
        // Firebase ist nicht verfügbar - verwende Demo-Daten
        console.log("Firebase nicht verfügbar, verwende Demo-Daten");
        setApps(DEMO_APPS);
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  // Neue App hinzufügen (Firebase-Version)
  const addAppToFirebase = async (newApp) => {
    if (!isFirebaseInitialized) {
      const error = new Error("Firebase ist nicht initialisiert");
      setError(error.message);
      throw error;
    }

    console.log("Versuche neue App hinzuzufügen:", newApp.title);
    
    try {
      const appData = {
        ...newApp,
        createdAt: serverTimestamp(),
        userId: user?.uid || 'anonymous',
      };
      
      console.log("App-Daten vorbereitet:", { ...appData, code: appData.code.substring(0, 20) + "..." });
      
      const docRef = await addDoc(collection(db, "apps"), appData);
      console.log("App erfolgreich gespeichert mit ID:", docRef.id);
      
      // Lokales State-Update für sofortige UI-Aktualisierung
      setApps(prevApps => [
        { 
          id: docRef.id, 
          ...newApp, 
          createdAt: new Date() 
        }, 
        ...prevApps
      ]);
      
      return docRef.id;
    } catch (err) {
      console.error("Fehler beim Hinzufügen der App:", err);
      setError(`Fehler beim Speichern der App: ${err.message}`);
      throw err;
    }
  };

  // Neue App hinzufügen (Demo-Version)
  const addAppToDemo = (newApp) => {
    console.log("Füge Demo-App hinzu:", newApp.title);
    const id = `demo${apps.length + 1}`;
    const newAppWithId = { 
      id, 
      ...newApp, 
      createdAt: new Date() 
    };
    
    setApps(prevApps => [newAppWithId, ...prevApps]);
    return Promise.resolve(id);
  };

  // Authentication functions
  const signup = async (email, password) => {
    if (!isFirebaseInitialized) {
      const error = new Error("Firebase ist nicht initialisiert");
      setError(error.message);
      throw error;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signin = async (email, password) => {
    if (!isFirebaseInitialized) {
      const error = new Error("Firebase ist nicht initialisiert");
      setError(error.message);
      throw error;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signout = async () => {
    if (!isFirebaseInitialized) {
      const error = new Error("Firebase ist nicht initialisiert");
      setError(error.message);
      throw error;
    }

    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  // Context-Wert erstellen
  const contextValue = {
    apps,
    loading,
    error,
    user,
    firebaseStatus,
    // Verwende die passende addApp-Funktion je nach Firebase-Status
    addApp: isFirebaseInitialized ? addAppToFirebase : addAppToDemo,
    signup,
    signin,
    signout,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);