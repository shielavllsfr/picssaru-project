import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../utils/firebase";

import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  FormControl,
  OutlinedInput,
  InputLabel,
  IconButton,
  InputAdornment,
  Card,
  Button,
  Typography,
} from "@material-ui/core";

import { Visibility, VisibilityOff } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loginCard: {
    maxWidth: "300px",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  errormsg: {
    margin: "10px 0",
  },
  fields: {
    margin: theme.spacing(1),
  },
}));

export default function Register() {
  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    showPassword: false,
    showPassword11: false,
    errors: "",
  });

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleClickShowPassword = (e) => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowPassword1 = (e) => {
    setValues({ ...values, showPassword1: !values.showPassword1 });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const register = () => {
    if (!values.email || !values.password || !values.confirmpassword) {
      setValues({ ...values, errors: "Please complete all fields!" });
    } else if (values.password !== values.confirmpassword) {
      setValues({ ...values, errors: "Passwords do not match!" });
    } else if (
      values.password.length < 6 ||
      values.confirmpassword.length < 6
    ) {
      setValues({
        ...values,
        errors: "Password must be atleast 6 characters!",
      });
    } else {
      setValues({ ...values, errors: "" });

      firebase
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((userCredential) => {
          var user = userCredential.user;
          console.log(user);
          // ...
        })
        .catch((error) => {
          //   var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          setValues({ ...values, errors: errorMessage });
        });
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" color="primary">
        REGISTER
      </Typography>

      <Card className={classes.loginCard}>
        <form className={classes.loginForm}>
          {values.errors && (
            <Alert className={classes.errormsg} severity="error">
              {values.errors}
            </Alert>
          )}
          <TextField
            className={classes.fields}
            id="email"
            label="Email Address"
            variant="outlined"
            value={values.email}
            onChange={handleChange("email")}
          />

          <FormControl className={classes.fields} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>

          <FormControl className={classes.fields} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="password"
              type={values.showPassword1 ? "text" : "password"}
              value={values.confirmpassword}
              onChange={handleChange("confirmpassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword1}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword1 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={133}
            />
          </FormControl>

          <Button
            className={classes.fields}
            variant="contained"
            color="primary"
            onClick={register}
          >
            REGISTER
          </Button>
          <Typography variant="h6" color="textPrimary">
            OR
          </Typography>
          <Button
            className={classes.fields}
            variant="contained"
            color="default"
            component={Link}
            to="/login"
          >
            SIGN IN
          </Button>
        </form>
      </Card>
    </div>
  );
}
