import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

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
    minWidth: "300px",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
  },
  fields: {
    margin: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
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

  return (
    <div className={classes.root}>
      <Typography variant="h5" color="primary">
        LOG IN
      </Typography>
      <Card className={classes.loginCard}>
        <form className={classes.loginForm}>
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
          >
            LOGIN
          </Button>
          <Button
            className={classes.fields}
            variant="contained"
            color="default"
          >
            SIGN UP
          </Button>
        </form>
      </Card>
    </div>
  );
}
