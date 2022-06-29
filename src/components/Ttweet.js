import React from "react";
import { fireDB } from "fb";
import { doc, deleteDoc } from "firebase/firestore";

export default function Ttweet({ ttweet, isOwner }) {
  const onClickDeleteBtn = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this ttweet?"
    );
    if (confirm) {
      // delete ttweet
      await deleteDoc(doc(fireDB, "ttweets", `${ttweet.id}`));
    } else {
      // cancel
    }
  };
  const onClickUpdateBtn = () => {};

  return (
    <div key={ttweet.createdAt}>
      <h4>{ttweet.text}</h4>
      {isOwner && (
        <>
          <button onClick={onClickDeleteBtn}>Delete</button>
          <button onClick={onClickUpdateBtn}>Update</button>
        </>
      )}
    </div>
  );
}
