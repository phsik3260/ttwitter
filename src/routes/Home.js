import React, { useState, useEffect } from "react";
import { fireDB } from "fb";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Ttweet from "components/Ttweet";
import { computeHeadingLevel } from "@testing-library/react";

export default function Home({ userInfo }) {
  const [ttweet, setTtweet] = useState("");
  const [ttweets, setTtweets] = useState([]);
  const getTtweets = async () => {
    // Real time
    const q = query(
      collection(fireDB, "ttweets"),
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
      setTtweets(ttweets);
    });
  };
  useEffect(() => {
    getTtweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // Create ttweet
      await addDoc(collection(fireDB, "ttweets"), {
        text: ttweet,
        createdAt: Date.now(),
        creatorId: userInfo.uid,
      });
    } catch (error) {
      // Error
      console.log(error);
    }
    setTtweet("");
  };
  const onChange = ({ target: { value } }) => {
    setTtweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's your mind?"
          maxLength="120"
          required
          value={ttweet}
          onChange={onChange}
        />
        <input type="submit" value="TTweet" />
      </form>
      <div>
        {ttweets.map((ttweet) => (
          <Ttweet
            key={ttweet.id}
            ttweet={ttweet}
            isOwner={ttweet.creatorId === userInfo.uid}
          />
        ))}
      </div>
    </div>
  );
}
