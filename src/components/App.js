import React, { useState, useEffect } from "react";
import Router from "components/Router";
import { fbApp, auth } from "fb";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is here
        setIsLoggedIn(true);
        // ...
      } else {
        // User is signed out
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return <>{init ? <Router isLoggedIn={isLoggedIn} /> : "Initializing..."}</>;
}
