// src/context/AppContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'; // Import Firebase Authentication functions

// Firebase Konfiguration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Track the currently signed-in user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  // Apps von Firebase laden
  useEffect(() => {
    const fetchApps = async () => {
      try {
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
        
        setApps(appsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching apps:", err);
        setError("Fehler beim Laden der Apps");
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  // Neue App hinzufügen
  const addApp = async (newApp) => {
    try {
      const appData = {
        ...newApp,
        createdAt: serverTimestamp(),
        userId: user.uid, // Associate the app with the user
      };
      
      const docRef = await addDoc(collection(db, "apps"), appData);
      
      // Lokales State-Update für sofortige UI-Aktualisierung
      setApps([
        { 
          id: docRef.id, 
          ...newApp, 
          createdAt: new Date() 
        }, 
        ...apps
      ]);
      
      return docRef.id;
    } catch (err) {
      console.error("Error adding app:", err);
      setError("Fehler beim Hinzufügen der App");
      throw err;
    }
  };

  // Authentication functions
  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AppContext.Provider value={{ 
      apps, 
      loading, 
      error,
      user, // Provide the user object to the context
      addApp,
      signup,
      signin,
      signout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
