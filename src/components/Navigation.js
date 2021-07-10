import React from "react";
import firebase from "../utils/firebase";
import ImportImage from "../img/ImportImage";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  fade,
  makeStyles,
} from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  imageDesign: {
    width: 200,
    height: 70,
    marginBottom: "-1.25rem !important",
  },
}));

export default function Navigation() {
  const classes = useStyles();

  const signout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        //Sign-out successful.
      })
      .catch((error) => {
        //An error happened.
      });
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Grid item>
            <img
              src={ImportImage.logo}
              className={classes.imageDesign}
              alt="logo"
            />
          </Grid>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit" component={Link} to="/dashboard">
              <HomeIcon />
            </IconButton>

            <IconButton color="inherit" component={Link} to="/favorites">
              <FavoriteIcon />
            </IconButton>

            <IconButton color="inherit" component={Link} to="/chat">
              <MailIcon />
            </IconButton>

            <IconButton color="inherit" component={Link} to="/profile">
              <AccountCircleIcon />
            </IconButton>

            <IconButton color="inherit" component={Link} to="/editprofile">
              <SettingsIcon />
            </IconButton>

            <IconButton color="inherit" onClick={signout}>
              <ExitToAppIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
