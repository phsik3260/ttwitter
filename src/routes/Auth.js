import React, { useState } from "react";
import { auth } from "fb";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = ({ target: { name, value } }) => {
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onClickSignIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Sign In
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        // Error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setError(errorMessage);
      });
  };
  const onClickSignUpAndSignIn = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Sign Up & Sign In
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        // Error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setError(errorMessage);
      });
  };
  const onClickSignInWithGoogle = (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Sign In with Google
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        // Error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setError(errorMessage);
      });
  };

  return (
    <div>
      <form>
        <input
          name="email"
          type="email"
          placeholder="email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="button" value="Sign In" onClick={onClickSignIn} />
        <input
          type="button"
          value="New Sign Up & Sign In"
          onClick={onClickSignUpAndSignIn}
        />
      </form>
      <form>
        <input
          type="button"
          value="Sign In with Google"
          onClick={onClickSignInWithGoogle}
        />
      </form>
      {error ? <div>{error}</div> : null}
    </div>
  );
}
