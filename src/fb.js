import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// initializeApp with Firebase

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export const fbApp = initializeApp(firebaseConfig);

// Firebase Auth

export const auth = getAuth();
