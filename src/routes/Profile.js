import React, { useState, useEffect } from "react";
import { auth } from "fb";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fireDB } from "fb";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import Ttweet from "components/Ttweet";

export default function Profile({ userInfo }) {
  const [myTtweets, setMyTtweets] = useState([]);
  const [newName, setNewName] = useState(userInfo.displayName);
  const [isEditing, setIsEditing] = useState(false);
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
  const getMyTtweets = () => {
    const q = query(
      collection(fireDB, "ttweets"),
      where("creatorId", "==", userInfo.uid),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const ttweets = [];
      querySnapshot.forEach((doc) => {
        const ttweetObj = {
          ...doc.data(),
          id: doc.id,
        };
        ttweets.push(ttweetObj);
      });
      setMyTtweets(ttweets);
    });
  };
  useEffect(() => {
    getMyTtweets();
  }, []);
  const onClickChangeName = () => {
    setIsEditing(true);
  };
  const onChange = ({ target: { value } }) => {
    setNewName(value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (userInfo.displayName !== newName) {
      // Update profile
      updateProfile(auth.currentUser, { displayName: newName }).then(
        () => window.location.reload(true) // Refresh page
      );
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div>
        {isEditing ? (
          <>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Change your Name!"
                maxLength="20"
                required
                value={newName}
                onChange={onChange}
              />
              <input type="submit" value="Done" />
            </form>
          </>
        ) : (
          <>
            <h1>Hello, {userInfo.displayName}</h1>
            <button onClick={onClickChangeName}>Change Your Name?</button>
          </>
        )}
      </div>
      {isEditing || <button onClick={onClickSignOutBtn}>Sign Out</button>}
      <div>
        <h2>My TTweets</h2>
        {myTtweets.map((myTtweet) => (
          <Ttweet
            key={myTtweet.id}
            ttweet={myTtweet}
            isOwner={myTtweet.creatorId === userInfo.uid}
          />
        ))}
      </div>
    </div>
  );
}
