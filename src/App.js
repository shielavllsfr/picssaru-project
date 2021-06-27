import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import firebase from "./utils/firebase";
import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";

/* THEME */
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./utils/theme";
import { makeStyles, CircularProgress } from "@material-ui/core";

/* PAGES */
import NotFound from "./pages/404";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Profile from "./pages/Profile";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
}));

export default function App() {
  const classes = useStyles();

  const [values, setValues] = useState({
    isAuth: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (signInUser) {
      if (signInUser) {
        setValues({ isAuth: true, user: signInUser, isLoading: false });
      } else {
        setValues({ isAuth: false, user: signInUser, isLoading: false });
      }
    });
  }, []);

  if (values.isLoading) {
    return (
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <CircularProgress color="primary" size={150} />
        </ThemeProvider>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>

          <PublicRoute
            component={Register}
            isAuth={values.isAuth}
            restricted={true}
            path="/register"
            exact
          />

          <PublicRoute
            component={Login}
            isAuth={values.isAuth}
            restricted={true}
            path="/login"
            exact
          />

          <PrivateRoute
            component={Dashboard}
            isAuth={values.isAuth}
            user={values.user}
            path="/dashboard"
          />

          <PrivateRoute
            component={User}
            isAuth={values.isAuth}
            user={values.user}
            path="/user"
          />

          <PrivateRoute
            component={Profile}
            isAuth={values.isAuth}
            user={values.user}
            path="/profile"
          />

          <Route component={NotFound} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
