import React from "react";
import firebase from "../utils/firebase";

export default function Navigation() {
  const signout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        //Sign-out successful.
      })
      .catch((error) => {
        //An error happened.
      });
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <button onClick={signout}>SIGN OUT</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
