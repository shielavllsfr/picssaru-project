import React, { useState } from "react";
import firebase from "../utils/firebase";
import { Link } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import ImportImage from "../img/ImportImage";

/* Themes */
import {
  makeStyles,
  TextField,
  FormControl,
  OutlinedInput,
  InputLabel,
  IconButton,
  InputAdornment,
  Card,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: `url(${ImportImage.bgLogin})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
  },
  loginCard: {
    maxWidth: "400px",
    minWidth: "400px",
    borderRadius: "10px",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
  },
  errormsg: {
    margin: "10px 0",
  },
  fields: {
    margin: theme.spacing(1),
  },
  picLogo: {
    width: 200,
    height: 130,
    marginLeft: "6.25rem !important",
  },
}));

export default function Login() {
  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
    isLoading: false,
    errors: "",
  });

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleClickShowPassword = (e) => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const login = (e) => {
    e.preventDefault();
    setValues({ ...values, isLoading: true });
    if (!values.email || !values.password) {
      setValues({
        ...values,
        errors: "Please complete all fields!",
        isLoading: false,
      });
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then((userCredential) => {
          setValues({ ...values, errors: " ", isLoading: false });
        })
        .catch((error) => {
          // var errorCode = error.code;
          var errorMessage = error.message;
          setValues({ ...values, errors: errorMessage, isLoading: false });
        });
    }
  };

  if (values.isLoading) {
    return (
      <div className={classes.root}>
        <CircularProgress color="primary" size={150} />
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <Card className={classes.loginCard}>
        <img src={ImportImage.logo1} className={classes.picLogo} alt="logo" />
        <Typography variant="h5" color="primary" align="center">
          LOG IN
        </Typography>
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

          <Button
            className={classes.fields}
            variant="contained"
            color="primary"
            onClick={login}
          >
            LOGIN
          </Button>
          <Button
            className={classes.fields}
            variant="contained"
            color="default"
            component={Link}
            to="/register"
          >
            SIGN UP
          </Button>
        </form>
      </Card>
    </div>
  );
}
