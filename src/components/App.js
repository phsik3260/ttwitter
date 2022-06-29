import React, { useState, useEffect } from "react";
import Router from "components/Router";
import { fbApp, auth } from "fb";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is here
        setIsLoggedIn(true);
        setUserInfo(user);
        // ...
      } else {
        // User is signed out
        setIsLoggedIn(false);
        setUserInfo(null);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <Router isLoggedIn={isLoggedIn} userInfo={userInfo} />
      ) : (
        "Initializing..."
      )}
    </>
  );
}
