import React, { useState, useEffect, useRef } from "react";
import firebase from "../utils/firebase";
import reactDom from "react-dom";
import Navigation from "../components/Navigation";
import ImportImage from "../img/ImportImage";

import {
  makeStyles,
  Typography,
  Grid,
  CardMedia,
  Card,
  Container,
  Backdrop,
  Modal,
  Fade,
  Avatar,
  IconButton,
  TextareaAutosize,
  Button,
  CardContent,
  Menu,
  MenuItem,
  CardHeader,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${ImportImage.bgNewsfeed})`,
  },
  postMargin: {
    marginRight: "2%",
    marginBottom: "2%",
  },
  centerContainer: {
    paddingLeft: "12%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minWidth: "40%",
    maxWidth: "40%",
    maxHeight: "65%",
    minHeight: "65%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  cancelButton: {
    fontWeight: "bold",
  },
  saveButton: {
    fontWeight: "bold",
  },
  profile: {
    display: "flex",
    marginTop: "3%",
    marginLeft: "30%",
  },
  avatarSize: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  postContainer: {
    marginTop: "5%",
    marginLeft: "12%",
  },
  profInfo: {
    paddingLeft: "7%",
  },
  uname: {
    marginTop: "1.25rem !important",
  },
}));

export default function Album() {
  const classes = useStyles();

  const db = firebase.firestore();
  const [profile, setProfile] = useState({
    profileURL: "",
    username: "",
    bio: "",
  });
  const imgContainer = useRef();
  const [open, setOpen] = React.useState(false);
  const [user_post, setUserPost] = useState({
    imageURL: "",
    imageName: "",
    caption: "",
    id: "",
  });
  const [user, setUser] = useState();
  const captionRef = useRef();
  const [saveState, setSaveState] = useState(false);
  const [editState, setEditState] = useState(false);
  const [viewState, setViewState] = useState(true);
  const [captionValue, setCaptionValue] = useState();
  const [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    const fetchData = () => {
      const currentUser = firebase.auth().currentUser;
      setUser(firebase.auth().currentUser.uid);

      let postArray = [];

      db.collection("users")
        .doc(currentUser.uid)
        .collection("user_post")
        .get()
        .then((doc) => {
          doc.forEach((post) => {
            const image = (
              <img
                id={post.id}
                name={post.data().caption}
                className={classes.postMargin}
                onClick={handleImageClick}
                key={post.id}
                src={post.data().imageURL}
                alt={[post.data().imageName]}
                height="300px"
                width="300px"
              />
            );
            postArray.push(image);
          });
          console.log(postArray);
          reactDom.render(postArray, imgContainer.current);
          console.log("post rendered");
        });

      db.collection("users")
        .doc(currentUser.uid)
        .collection("profile_info")
        .get()
        .then((profile_info) => {
          profile_info.forEach((user) => {
            setProfile({
              profileURL: user.data().info_changes.profileURL,
              username: user.data().info_changes.name,
              bio: user.data().info_changes.bio,
            });
          });
        });
    };
    fetchData();
  }, []);

  const handleImageClick = (event) => {
    setOpen(true);
    setUserPost({
      imageURL: event.currentTarget.src,
      imageName: event.currentTarget.alt,
      caption: event.currentTarget.name,
      id: event.currentTarget.id,
    });
    setViewState(true);
    setCaptionValue(event.currentTarget.name);
    setSaveState(true);
    setSelectedImage(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setEditState(false);
    setCaptionValue("");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleContextClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleContextClose = () => {
    setAnchorEl(null);
  };

  const optionHandler = (event) => {
    handleContextClose();
    const firestore = firebase.firestore();
    const storage = firebase.storage();
    if (event.target.id === "delete") {
      //delete
      console.log("delete post");

      firestore
        .collection("users")
        .doc(user)
        .collection("user_post")
        .doc(user_post.id)
        .delete()
        .then(() => {
          handleClose();
          storage
            .ref()
            .child("folder/" + user + " post/" + user_post.imageName)
            .delete()
            .then(() => {
              document.getElementById(user_post.id).style.display = "none";
              console.log("deleted");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (event.target.id === "edit") {
      //edit
      console.log("edit post");
      setViewState(false);
      setEditState(true);
      setCaptionValue(user_post.caption);
    }
  };

  const handleCaption = (event) => {
    console.log(event.currentTarget.value);
    setCaptionValue(event.currentTarget.value);

    if (event.currentTarget.value !== user_post.caption) {
      setSaveState(false);
    } else {
      setSaveState(true);
    }
  };

  const cancelEdit = (event) => {
    console.log("cancel edit");
    setEditState(false);
    setViewState(true);
    setCaptionValue("");
  };

  const saveEdit = (event) => {
    console.log("saving edit");

    user_post.caption = captionValue;

    db.collection("users")
      .doc(user)
      .collection("user_post")
      .doc(user_post.id)
      .update({ caption: captionValue })
      .then((res) => {
        selectedImage.name = captionValue;
        console.log("updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.root}>
      <React.Fragment>
        <Navigation />
        <Grid className={classes.profile}>
          <Avatar className={classes.avatarSize} src={profile.profileURL} />
          <Grid className={classes.profInfo}>
            <Grid>
              <Typography variant="h4" className={classes.uname}>
                {profile.username}
              </Typography>
            </Grid>
            <Grid>
              <Typography style={{ marginTop: "2%", maxWidth: "50%" }}>
                {profile.bio}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <main>
          <Container>
            <Grid className={classes.postContainer}>
              <Grid ref={imgContainer}></Grid>
            </Grid>
          </Container>
        </main>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar
                      className={classes.avatar}
                      src={profile.profileURL}
                    ></Avatar>
                  }
                  action={
                    <Grid>
                      <IconButton
                        aria-label="settings"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleContextClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleContextClose}
                      >
                        <MenuItem onClick={optionHandler} id="delete">
                          Delete Post
                        </MenuItem>
                        <MenuItem onClick={optionHandler} id="edit">
                          Edit Post
                        </MenuItem>
                      </Menu>
                    </Grid>
                  }
                  title={profile.username}
                />
                <CardMedia
                  className={classes.media}
                  image={user_post.imageURL}
                />
                <CardContent>
                  {viewState ? (
                    <Typography
                      ref={captionRef}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {user_post.caption}
                    </Typography>
                  ) : null}
                  {editState ? (
                    <TextareaAutosize
                      rowsMax={4}
                      aria-label="maximum height"
                      placeholder="Write a Caption"
                      onChange={handleCaption}
                      value={captionValue}
                    />
                  ) : null}
                </CardContent>

                {editState ? (
                  <Button
                    color="secondary"
                    variant="contained"
                    className={classes.cancelButton}
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                ) : null}
                {editState ? (
                  <Button
                    disabled={saveState}
                    variant="contained"
                    color="primary"
                    className={classes.saveButton}
                    onClick={saveEdit}
                  >
                    Save
                  </Button>
                ) : null}
              </Card>
            </div>
          </Fade>
        </Modal>
      </React.Fragment>
    </div>
  );
}
