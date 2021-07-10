import React, { useState, useEffect } from "react";
import firebase from "../utils/firebase";
import { makeStyles, Grid, Button, TextField } from "@material-ui/core";

const db = firebase.firestore();
const auth = firebase.auth();

const useStyles = makeStyles((theme) => ({
  txtbox: {
    margin: theme.spacing(1),
    width: theme.spacing(90),
    height: "-10",
    backgroundColor: "white",
    borderRadius: "10px",
    marginLeft: "2.75rem !important",
  },
  butt: {
    marginTop: ".65rem !important",
    width: theme.spacing(19),
    height: theme.spacing(6),
    fontSize: [20, "!important"],
  },
}));

export default function SendMessage({ scroll }) {
  const classes = useStyles();
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState({ email: "" });

  useEffect(() => {
    var user = firebase.auth().currentUser;
    if (user) {
      setUser(user);
      console.log(user);
    } else {
    }
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    const { uid } = auth.currentUser;

    await db.collection("message").add({
      text: msg,
      photoURL: user.email,
      uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setMsg("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      <form onSubmit={sendMessage}>
        <Grid container direction="column">
          <Grid item direction="column">
            <TextField
              variant="outlined"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className={classes.txtbox}
              placeholder="Enter you message..."
            />
            <Button
              className={classes.butt}
              type="submit"
              variant="contained"
              color="primary"
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
