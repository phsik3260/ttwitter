import React, { useState, useEffect } from "react";
import { fireDB } from "fb";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Home() {
  const [ttweet, setTtweet] = useState("");
  const [ttweets, setTtweets] = useState([]);
  const getTtweets = async () => {
    const querySnapshot = await getDocs(collection(fireDB, "ttweets"));
    querySnapshot.forEach((doc) => {
      const ttweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setTtweets((curr) => [ttweetObj, ...curr]);
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
        ttweet,
        createdAt: Date.now(),
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
          <div key={ttweet.id}>
            <h4>{ttweet.ttweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
