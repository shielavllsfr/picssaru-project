import React, { useState, useEffect } from "react";
import firebase from "../utils/firebase";

import {
  Grid,
  TextField,
  Card,
  CardContent,
  makeStyles,
  Button,
  Typography,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    direction: "column",
  },
  card: {
    width: 500,
    marginTop: 20,
  },
  taskDone: {
    textDecoration: "underline",
  },
}));

const db = firebase.firestore();

export default function Dashboard() {
  const classes = useStyle();

  const [state, setstate] = useState({
    tasks: [],
    userUid: "",
  });

  const [payload, setPayload] = useState({
    task: "",
  });

  useEffect(() => {
    const fetchData = () => {
      const currentUser = firebase.auth().currentUser;

      db.collection("users")
        .doc(currentUser.uid)
        .collection("comments")
        .orderBy("created_at", "asc")
        .onSnapshot((doc) => {
          let taskList = [];
          doc.forEach((task) => {
            taskList.push({ ...task.data(), id: task.id });
          });
          setstate({
            tasks: taskList,
            userUid: currentUser.uid,
          });
        });
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setPayload({ task: e.target.value });
  };

  const addTask = () => {
    db.collection("users")
      .doc(state.userUid)
      .collection("comments")
      .add({ task: payload.task, created_at: new Date() })
      .then((docRef) => {
        //success
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteTask = (docId) => {
    db.collection("users")
      .doc(state.userUid)
      .collection("comments")
      .doc(docId)
      .delete()
      .then(() => {
        //success
      })
      .catch((err) => {
        //error
      });
  };

  return (
    <div className="mydiv">
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item className={classes.card}>
          <Card>
            <CardContent>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                {state.tasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <Grid container justify="center" alignItems="center">
                      <Typography
                        key={task.id}
                        variant="h6"
                        component={Button}
                        className={
                          task.status === "done" ? classes.taskDone : null
                        }
                      >
                        {task.task}
                      </Typography>
                      <IconButton onClick={() => deleteTask(task.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              <Grid container spacing={2} alignItems="center" justify="center">
                <TextField
                  variant="outlined"
                  label="Comments"
                  value={payload.task}
                  onChange={handleChange}
                />
                <Grid item>
                  <Button variant="contained" color="primary" onClick={addTask}>
                    ADD
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
