import React, { useState } from "react";
import Router from "./Router";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Router isLoggedIn={isLoggedIn} />
    </>
  );
}
