import React, { useState } from "react";
import { fireDB, storage } from "fb";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export default function Ttweet({ ttweet, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTtweet, setNewTtweet] = useState(ttweet.text);
  const onClickDeleteBtn = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this ttweet?"
    );
    if (confirm) {
      // Delete ttweet
      await deleteDoc(doc(fireDB, "ttweets", `${ttweet.id}`));
      // Delete image
      if (ttweet.imgUrl) {
        await deleteObject(ref(storage, ttweet.imgUrl));
      }
    }
  };
  const onClickEditBtn = () => {
    setIsEditing(true);
  };
  const onClickCancelBtn = () => {
    setIsEditing(false);
  };
  const onChange = ({ target: { value } }) => {
    setNewTtweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    // Edit ttweet
    await updateDoc(doc(fireDB, "ttweets", `${ttweet.id}`), {
      text: newTtweet,
    });
    setIsEditing(false);
  };

  return isEditing ? (
    isOwner && (
      <>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Edit your TTweet!"
            maxLength="120"
            required
            value={newTtweet}
            onChange={onChange}
          />
          <input type="submit" value="Update TTweet" />
        </form>
        <button onClick={onClickCancelBtn}>Cancel</button>
      </>
    )
  ) : (
    <div key={ttweet.createdAt}>
      <h4>{ttweet.text}</h4>
      {ttweet.imgUrl && (
        <img src={ttweet.imgUrl} width="100px" height="100px" />
      )}
      {isOwner && (
        <>
          <button onClick={onClickDeleteBtn}>Delete</button>
          <button onClick={onClickEditBtn}>Edit</button>
        </>
      )}
    </div>
  );
}
