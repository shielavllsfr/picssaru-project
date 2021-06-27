import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import firebase from "../utils/firebase";

export default function Dashboard() {
  const [user, setUser] = useState({ email: "" });

  useEffect(() => {
    var user = firebase.auth().currentUser;
    if (user) {
      setUser(user);
    } else {
    }
  }, []);

  return (
    <div>
      <Navigation />
      <h1> {user.email} </h1>
    </div>
  );
}
