import React, { useState, useEffect, useRef } from "react";
import SendMessage from "../pages/SendMessage";
import firebase from "../utils/firebase";
import Navigation from "../components/Navigation";
import ImportImage from "../img/ImportImage";

import {
  makeStyles,
  Card,
  Grid,
  CardContent,
  Avatar,
  Typography,
} from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";

const db = firebase.firestore();
const auth = firebase.auth();

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1),
    minWidth: "880px",
    maxWidth: "880px",
  },
  cards: {
    maxWidth: "400px",
    minWidth: "1180px",
    borderRadius: "10px",
    marginLeft: "5.25rem !important",
    marginTop: "3.25rem !important",
    marginBottom: "3.25rem !important",
    display: "flex",
    flexDirection: "column",
    backgroundImage: `url(${ImportImage.chatBg})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
  },
  cc: {
    marginLeft: "5.25rem !important",
    marginTop: "3.25rem !important",
  },
  typo: {
    marginTop: "2rem !important",
  },
  avatarSize: {
    marginTop: ".60rem !important",
    width: theme.spacing(5),
    height: theme.spacing(5),
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
    textTransform: "uppercase",
  },
  typs: {
    marginTop: "1.50rem !important",
    marginLeft: ".50rem !important",
    fontSize: [12, "!important"],
  },
  typs1: {
    marginTop: ".20rem !important",
    marginLeft: ".50rem !important",
    fontWeight: "bolder",
  },
}));

export default function Chat() {
  const scroll = useRef();
  const classes = useStyles();
  const [message, setMessage] = useState([]);

  useEffect(() => {
    db.collection("message")
      .orderBy("createdAt")
      .limit(50)
      .onSnapshot((snapshot) => {
        setMessage(snapshot.docs.map((doc) => doc.data()));
      });
  }, []);

  return (
    <div>
      <Navigation />

      <Card className={classes.cards}>
        <Typography variant="h4" align="center" className={classes.typo}>
          GLOBAL CHAT
        </Typography>
        <Typography variant="h6" align="center">
          Connect with all the users of picssaru website. Enjoy!
        </Typography>
        <CardContent className={classes.cc}>
          {message.map(({ id, text, photoURL, uid }) => (
            <div
              key={id}
              className={`msg ${
                uid === auth.currentUser.uid ? "sent" : "received"
              }`}
            >
              <Grid container>
                <Avatar
                  src={photoURL}
                  alt={photoURL}
                  className={classes.avatarSize}
                />

                <Card elevation={12} p={-10} className={classes.paper}>
                  <CardContent>
                    <Typography className={classes.typs}>
                      {photoURL}:
                    </Typography>
                    <Typography className={classes.typs1}>{text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </div>
          ))}
          <SendMessage scroll={scroll} />
          <div ref={scroll}></div>
        </CardContent>
      </Card>
    </div>
  );
}
