import React, { useState } from "react";
import firebase from "../utils/firebase";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: "25ch",
    },
  },
}));

export default function ChangePass() {
  const classes = useStyles();

  const [value, setValue] = useState({
    currentPassword: "",
    new: "",
    rpassword: "",
  });

  const handleChange = (prop) => (event) => {
    setValue({ ...value, [prop]: event.target.value });
  };

  const reauthenticate = (currentPassword) => {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      value.currentPassword
    );
    return user.reauthenticateWithCredential(credential);
  };

  const change = (e) => {
    e.preventDefault();

    if (!value.currentPassword || !value.new || !value.rpassword) {
      alert("Some fields is missing");
    } else if (value.new !== value.rpassword) {
      alert("Password do not match");
    } else {
      reauthenticate(value.currentPassword)
        .then(() => {
          const user = firebase.auth().currentUser;
          user
            .updatePassword(value.new)
            .then(() => {
              alert("Password Change Successfully");
            })
            .catch((error) => {
              // An error ocurred
              var errorMessage = error.message;
              // ..
              alert(errorMessage);
              // ...
            });
        })
        .catch((error) => {
          var errorMessage = error.message;
          alert(errorMessage);
        });
    }
  };

  return (
    <div>
      <Grid
        container
        spacing={3}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <form className={classes.root} noValidate autoComplete="off">
          <h2>Change Password</h2>

          <label for="password">Old Password</label>
          <TextField
            type="password"
            id="current"
            label="Old Password"
            onChange={handleChange("currentPassword")}
            value={value.currentPassword}
            variant="outlined"
          />
          <br></br>
          <label for="password">New Password</label>
          <TextField
            type="password"
            id="new"
            label="New Password"
            onChange={handleChange("new")}
            value={value.new}
            variant="outlined"
          />
          <br></br>
          <label for="rpassword"> Confirm Password</label>
          <TextField
            type="password"
            id="rpassword"
            label="New Password"
            onChange={handleChange("rpassword")}
            value={value.rpassword}
            variant="outlined"
          />
          <br></br>
          <Button variant="contained" color="primary" onClick={change}>
            Ok
          </Button>
        </form>
      </Grid>
    </div>
  );
}
