import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./utils/theme";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

export default function App() {
  return <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <Route path="/">
        <Redirect to="/login" />
      </Route>
        <Route path ="/login" component = { } />
      </Switch>
    </Router>
  </ThemeProvider>;
}
