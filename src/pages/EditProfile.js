import React, { useState, useEffect, ref, useRef } from "react";
import firebase from "../utils/firebase";
import Navigation from "../components/Navigation";
import PropTypes from "prop-types";
import MuiPhoneNumber from "material-ui-phone-number";
import {
  Grid,
  Tab,
  Tabs,
  Box,
  makeStyles,
  TextField,
  Button,
  Link,
  Card,
  CardContent,
  TextareaAutosize,
  Typography,
  FormControlLabel,
  Checkbox,
  Avatar,
} from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 1000,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    marginLeft: "19.25rem !important",
    paddingTop: "9.25rem !important",
  },
  card: {
    width: 500,
  },
  grid: {
    paddingTop: "1.25rem !important",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const db = firebase.firestore();
  const uid = firebase.auth().currentUser.uid;

  const name = useRef();
  const username = useRef();
  const website = useRef();
  const bio = useRef();
  const email = useRef();
  const mobile = useRef();
  const gender = useRef();
  const disabled = useRef();

  const [profileExists, setProfileExists] = useState();
  const [profileID, setProfileId] = useState();
  const [path, setPath] = useState();
  const [image, setImage] = useState();
  const [profileImgChange, setProfileImgChanged] = useState();
  const [imageURL, setImageURL] = useState();

  const submitHandler = (event) => {
    let file = image;
    var storage = firebase.storage();
    var storageRef = storage.ref();

    const info_changes = {
      profileURL: imageURL,
      name: name.current.firstChild.firstChild.value,
      username: username.current.firstChild.firstChild.value,
      website: website.current.firstChild.firstChild.value,
      bio: bio.current.value,
      email: email.current.firstChild.firstChild.value,
      mobile: mobile.current.inputRef.value,
      gender: gender.current.firstChild.firstChild.value,
      disabled: disabled.current.firstChild.firstChild.checked,
    };

    if (profileImgChange) {
      var uploadTask = storageRef
        .child("profiles/" + uid + " profile")
        .put(file);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            setImageURL(url);
            info_changes.profileURL = url;
            uploadChanges(info_changes);
          });
        }
      );
    } else {
      uploadChanges(info_changes);
    }
  };

  function uploadChanges(info_changes) {
    const collection = db
      .collection("users")
      .doc(uid)
      .collection("profile_info");
    if (profileExists && profileID != null) {
      collection
        .doc(profileID)
        .update({ info_changes })
        .then((res) => {
          console.log("updated");
          setOpenSnack(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      collection
        .add({ info_changes })
        .then((res) => {
          console.log("saved");
          console.log(res.id);
          setProfileId(res.id);
          setProfileExists(true);
          setOpenSnack(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.log(profileID);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("profile_info")
          .get()
          .then((user_info) => {
            user_info.forEach((user) => {
              console.log(user.id);
              setProfileId(user.id);
              setProfileExists(true);
              setPath(user.data().info_changes.profileURL);
              setImageURL(user.data().info_changes.profileURL);
              name.current.firstChild.firstChild.value =
                user.data().info_changes.name;
              username.current.firstChild.firstChild.value =
                user.data().info_changes.username;
              website.current.firstChild.firstChild.value =
                user.data().info_changes.website;
              bio.current.value = user.data().info_changes.bio;
              email.current.firstChild.firstChild.value =
                user.data().info_changes.email;
              mobile.current.inputRef.value = user.data().info_changes.mobile;
              gender.current.firstChild.firstChild.value =
                user.data().info_changes.gender;
              disabled.current.firstChild.firstChild.checked =
                user.data().info_changes.disabled;
            });
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const [snack, setOpenSnack] = React.useState(false);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const profilePictureHandler = (event) => {
    if (event.target.files[0] !== undefined) {
      var file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPath(reader.result);
        setImage(event.target.files[0]);
        setProfileImgChanged(true);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  return (
    <div>
      <Navigation />

      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Edit Profile" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
          <Tab label="Login History" {...a11yProps(2)} />
          <Tab label="Switch Account" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={value} index={0} spacing={2}>
          <Card className={classes.card}>
            <CardContent>
              <Grid
                item
                xs
                container
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <Avatar alt="USERNAME" src={path} className={classes.large} />
                <Link href="#" variant="body2" component="label">
                  <input
                    hidden
                    type="file"
                    onChange={profilePictureHandler}
                  ></input>
                  Change Profile Photo
                </Link>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Name
                  <TextField
                    id="filled-size-small"
                    variant="filled"
                    size="small"
                    fullWidth
                    ref={name}
                  />
                </Grid>
              </Grid>

              <Grid>
                You are using the same name on instagram and facebook. Go to the
                facebook to change your name.
                <a target="_blank" href="https://facebook.com" rel="noreferrer">
                  Change Name
                </a>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Username
                  <TextField
                    id="filled-size-small"
                    variant="outlined"
                    size="small"
                    fullWidth
                    ref={username}
                  />
                </Grid>
              </Grid>

              <Grid>
                In most circumstances, you'll be able change your username back
                to same username for another 14 days.
                <Link href="#" variant="body2">
                  Learn More.
                </Link>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Website
                  <TextField
                    id="filled-size-small"
                    variant="outlined"
                    size="small"
                    fullWidth
                    ref={website}
                  />
                </Grid>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Bio
                  <br />
                  <TextareaAutosize
                    aria-label="minimum height"
                    rowsMin={2}
                    rowsMax={2}
                    placeholder="Tell me about yourself ❤"
                    maxwidth="100%"
                    ref={bio}
                  />
                </Grid>
              </Grid>

              <Grid
                item
                container
                alignItems="center"
                justify="center"
                className={classes.grid}
              >
                PERSONAL INFORMATION
                <Grid>
                  Provide your personal information, even if the account used
                  for a business, a pet or something else. This won't be a part
                  of your public profile.
                </Grid>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Email
                  <TextField
                    id="filled-size-small"
                    variant="outlined"
                    size="small"
                    fullWidth
                    ref={email}
                  />
                </Grid>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Phone Number
                  <MuiPhoneNumber
                    preferredCountries={["ph"]}
                    disableAreaCodes={true}
                    defaultCountry={"ph"}
                    variant="outlined"
                    type="tel"
                    fullWidth
                    ref={mobile}
                  />
                </Grid>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Gender
                  <TextField
                    inputRef={ref}
                    id="filled-size-small"
                    variant="outlined"
                    size="small"
                    fullWidth
                    ref={gender}
                  />
                </Grid>

                <Grid item container alignItems="center" spacing={4}>
                  <Grid item>
                    <Link href="#" variant="body2">
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite />}
                            name="checkedH"
                            color="primary"
                            ref={disabled}
                          />
                        }
                        label="Temporarily disable my account."
                      />
                    </Link>

                    <Grid item container alignItems="center" spacing={2}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={submitHandler}
                        >
                          SUBMIT
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid item xs container justify="center" alignItems="center">
            CHANGE PASSWORD
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          LOGIN HISTORY
        </TabPanel>
        <TabPanel value={value} index={3}>
          SWITCH ACCOUNT
        </TabPanel>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snack}
        autoHideDuration={2000}
        onClose={handleSnackClose}
        message="SAVED"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}