import React, { useState, useEffect } from "react";
import firebase from "../utils/firebase";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";

import {
  Grid,
  TextField,
  Card,
  CardContent,
  makeStyles,
  Button,
  CircularProgress,
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
  button: {
    marginTop: "2.25rem !important",
  },
}));

const db = firebase.firestore();

export default function Dashboard() {
  const classes = useStyle();

  const [state, setstate] = useState({
    tasks: [],
    userUid: "",
    isLoading: true,
  });

  const [payload, setPayload] = useState({
    task: "",
  });

  useEffect(() => {
    const fetchData = () => {
      const currentUser = firebase.auth().currentUser;

      db.collection("users")
        .doc(currentUser.uid)
        .collection("tasks")
        .orderBy("created_at", "desc")
        .onSnapshot((doc) => {
          let taskList = [];
          doc.forEach((task) => {
            taskList.push({ ...task.data(), id: task.id });
          });
          setstate({
            tasks: taskList,
            userUid: currentUser.uid,
            isLoading: false,
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
      .collection("tasks")
      .add({ task: payload.task, status: "pending", created_at: new Date() })
      .then((docRef) => {
        //success
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const toggleTask = (docId, status) => {
    let updatedStatus;
    if (status === "done") {
      updatedStatus = "pending";
    } else {
      updatedStatus = "done";
    }
    db.collection("users")
      .doc(state.userUid)
      .collection("tasks")
      .doc(docId)
      .update({ status: updatedStatus })
      .then((doc) => {
        //success
      })
      .catch((err) => {
        //error
      });
  };

  const deleteTask = (docId) => {
    db.collection("users")
      .doc(state.userUid)
      .collection("tasks")
      .doc(docId)
      .delete()
      .then(() => {
        //success
      })
      .catch((err) => {
        //error
      });
  };

  if (state.isLoading) {
    return (
      <div className={classes.root}>
        <CircularProgress color="primary" size={150} />
      </div>
    );
  }

  return (
    <div className="mydiv">
      <Navigation />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        component={Link}
        to="/editprofile"
      >
        EDIT PROFILE
      </Button>
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item className={classes.card}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center" justify="center">
                <TextField
                  variant="outlined"
                  label="Task"
                  value={payload.task}
                  onChange={handleChange}
                />
                <Grid item>
                  <Button variant="contained" color="primary" onClick={addTask}>
                    ADD
                  </Button>
                </Grid>
              </Grid>
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
                        onClick={() => toggleTask(task.id, task.status)}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
