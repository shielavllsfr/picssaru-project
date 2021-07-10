import React, { useState, useEffect, ref, useRef } from "react";
import firebase from "../utils/firebase";
import Navigation from "../components/Navigation";

/* THEME */
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
  Card,
  Link,
  CardContent,
  TextareaAutosize,
  Typography,
  Avatar,
  Snackbar,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";

/* ICONS */
import CloseIcon from "@material-ui/icons/Close";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { Visibility, VisibilityOff } from "@material-ui/icons";

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
  but: {
    marginTop: "1.25rem !important",
  },
  field: {
    margin: theme.spacing(1),
  },
  cpCard: {
    maxWidth: "400px",
    minWidth: "400px",
    borderRadius: "10px",
    marginLeft: "5.25rem !important",
    marginTop: "3.25rem !important",
  },
  cpform: {
    display: "flex",
    flexDirection: "column",
  },
  buuuut: {
    marginLeft: ".50rem !important",
    marginRight: ".50rem !important",
    marginBottom: "1.50rem !important",
    marginTop: "1.50rem !important",
  },
  formm: {
    marginTop: "1.50rem !important",
    marginLeft: ".50rem !important",
    marginRight: ".50rem !important",
  },
  card3: {
    maxWidth: "400px",
    minWidth: "400px",
    borderRadius: "10px",
    marginLeft: "5.25rem !important",
    marginTop: "6.25rem !important",
    paddingLeft: "2rem !important",
    paddingTop: "2rem !important",
    paddingRight: "2rem !important",
    paddingBottom: "2rem !important",
  },
  but3: {
    marginTop: "1rem !important",
    marginLeft: "7.20rem !important",
  },
}));

export default function EditProfile() {
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
  }, [uid]);

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

  // CHANGE PASSWORD
  const [values, setValues] = useState({
    currentPassword: "",
    new: "",
    rpassword: "",
    showPassword: false,
    showPassword1: false,
    showPassword2: false,
  });

  const handleClickShowPassword = (e) => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowPassword1 = (e) => {
    setValues({ ...values, showPassword1: !values.showPassword1 });
  };

  const handleClickShowPassword2 = (e) => {
    setValues({ ...values, showPassword2: !values.showPassword2 });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleChanges = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const reauthenticate = (currentPassword) => {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      values.currentPassword
    );
    return user.reauthenticateWithCredential(credential);
  };

  const change = (e) => {
    e.preventDefault();

    if (!values.currentPassword || !values.new || !values.rpassword) {
      alert("Please complete all fields.");
    } else if (values.new !== values.rpassword) {
      alert("Passwords does not match!");
    } else {
      reauthenticate(values.currentPassword)
        .then(() => {
          const user = firebase.auth().currentUser;
          user
            .updatePassword(values.new)
            .then(() => {
              alert("Password Changed Successfully!");
              window.location.reload();
            })
            .catch((error) => {
              var errorMessage = error.message;
              alert(errorMessage);
            });
        })
        .catch((error) => {
          var errorMessage = error.message;
          alert(errorMessage);
        });
    }
  };

  //SWITCH ACCOUNT
  const signout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        //Switched account successful.
      })
      .catch((error) => {
        //An error happened.
      });
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
          <Tab label="Switch Account" {...a11yProps(2)} />
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
                You can use your Facebook name.
                <a target="_blank" href="https://facebook.com" rel="noreferrer">
                  Check it out here.
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

              <Grid>Choose unique and awesome username.</Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Address
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
                  Recovery Email
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
                            checkedIcon={<FavoriteIcon />}
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
                          className={classes.but}
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
            <Grid
              container
              spacing={3}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Card className={classes.cpCard}>
                <Typography variant="h6" align="center">
                  Change Password
                  <Typography>
                    Become more secured while using our website.{" "}
                  </Typography>
                </Typography>
                <form className={classes.cpform} noValidate autoComplete="off">
                  <FormControl variant="outlined" className={classes.formm}>
                    <InputLabel htmlFor="outlined-adornment-password">
                      Old Password
                    </InputLabel>
                    <OutlinedInput
                      id="current"
                      onChange={handleChanges("currentPassword")}
                      value={values.currentPassword}
                      variant="outlined"
                      type={values.showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={100}
                    />
                  </FormControl>

                  <FormControl variant="outlined" className={classes.formm}>
                    <InputLabel htmlFor="new">New Password</InputLabel>
                    <OutlinedInput
                      id="new"
                      onChange={handleChanges("new")}
                      value={values.new}
                      type={values.showPassword1 ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword1}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword1 ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={105}
                    />
                  </FormControl>

                  <FormControl variant="outlined" className={classes.formm}>
                    <InputLabel htmlFor="rpassword">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      id="rpassword"
                      label="New Password"
                      onChange={handleChanges("rpassword")}
                      value={values.rpassword}
                      variant="outlined"
                      type={values.showPassword2 ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword2}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword2 ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={125}
                    />
                  </FormControl>

                  <Button
                    className={classes.buuuut}
                    variant="contained"
                    minWidth="30px"
                    color="primary"
                    onClick={change}
                  >
                    SUBMIT
                  </Button>
                </form>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Card className={classes.card3}>
            <Typography align="center">
              Click the button if you want to switch an account. <br />
              Switching account may lead to logging out of the current account.
            </Typography>
            <Button
              color="primary"
              variant="contained"
              className={classes.but3}
              onClick={signout}
            >
              SWITCH ACCOUNT
            </Button>
          </Card>
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
