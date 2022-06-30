import React, { useState, useEffect, useRef } from "react";
import { fireDB } from "fb";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Ttweet from "components/Ttweet";

export default function Home({ userInfo }) {
  const [ttweet, setTtweet] = useState("");
  const [ttweets, setTtweets] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const fileInput = useRef();
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
  const onChangeFile = ({ target: { files } }) => {
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file); // Read file
    reader.addEventListener("loadend", ({ currentTarget: { result } }) =>
      setAttachment(result)
    ); //  Then triger loadend and get image
  };
  const onClickClearImgBtn = () => {
    fileInput.current.value = null;
    setAttachment(null);
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
        <input
          type="file"
          accept="image/*"
          onChange={onChangeFile}
          ref={fileInput}
        />
        <input type="submit" value="TTweet" />
        {attachment && (
          <div>
            <img src={attachment} width="100px" height="100px" />
            <button onClick={onClickClearImgBtn}>Clear Img</button>
          </div>
        )}
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
