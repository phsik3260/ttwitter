import React from "react";
import { auth } from "fb";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const onClickSignOutBtn = () => {
    signOut(auth)
      .then(() => {
        // Sign Out
      })
      .catch((error) => {
        // Error
        console.log(error);
      });
    navigate("/");
  };

  return (
    <div>
      <div>This is Profile Page.</div>
      <button onClick={onClickSignOutBtn}>Sign Out</button>
    </div>
  );
}
