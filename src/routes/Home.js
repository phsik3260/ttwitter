import React, { useState, useEffect, useRef } from "react";
import { fireDB, storage } from "fb";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Ttweet from "components/Ttweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

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

    const ttweetObj = {
      text: ttweet,
      createdAt: Date.now(),
      creatorId: userInfo.uid,
    };

    if (attachment !== null) {
      // Image ref
      const imagesRef = ref(storage, `${userInfo.uid}/${uuidv4()}`);
      // Image URL upload to Storage
      await uploadString(imagesRef, attachment, "data_url");
      // Get image URL
      await getDownloadURL(imagesRef)
        .then((url) => {
          ttweetObj["imgUrl"] = url;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    try {
      // Create ttweet
      await addDoc(collection(fireDB, "ttweets"), ttweetObj);
    } catch (error) {
      // Error
      console.log(error);
    }

    setTtweet("");
    fileInput.current.value = null;
    setAttachment(null);
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
        <h2>All TTweets</h2>
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
