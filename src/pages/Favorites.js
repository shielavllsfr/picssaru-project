import React, { useState, useEffect, useRef } from "react";
import firebase from "../utils/firebase";
import reactDom from "react-dom";
import Navigation from "../components/Navigation";
import ImportImage from "../img/ImportImage";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

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
  CardContent,
  CardHeader,
  Checkbox,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${ImportImage.bgNewsfeed})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    border: "none",
    boxShadow: "none",
  },
  root1: {
    backgroundImage: `url(${ImportImage.divBg})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    height: "100vh",
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
    maxHeight: "105%",
    minHeight: "105%",
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
    paddingTop: "56.25%",
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
  ty: {
    paddingTop: "2.25rem !important",
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
  const favLikedIcon =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
  const favRef = useRef();
  const [favState, setFavState] = useState(true);
  const [postId, setPostId] = useState();
  const [selectedPost, setSelectedPost] = useState();

  useEffect(() => {
    const fetchData = () => {
      const currentUser = firebase.auth().currentUser;
      setUser(firebase.auth().currentUser.uid);

      let postArray = [];

      db.collection("users")
        .doc(currentUser.uid)
        .collection("liked_post")
        .get()
        .then((doc) => {
          doc.forEach((post) => {
            const image = (
              <img
                id={post.id + " " + post.data().userId}
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
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes.postMargin, db]);

  const handleImageClick = (event) => {
    setOpen(true);
    const IDs = event.currentTarget.id.split(" ");
    setUserPost({
      imageURL: event.currentTarget.src,
      imageName: event.currentTarget.alt,
      caption: event.currentTarget.name,
      id: IDs[0],
    });

    db.collection("users")
      .doc(IDs[1])
      .collection("profile_info")
      .get()
      .then((profile_info) => {
        profile_info.forEach((user) => {
          setProfile({
            profileURL: user.data().info_changes.profileURL,
            username: user.data().info_changes.username,
            bio: user.data().info_changes.bio,
          });
        });
      });
    console.log(event.currentTarget.id.split(" "));
    setFavState(true);
    setPostId(IDs[0]);
    setSelectedPost(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const likeHandler = (event) => {
    const likedCollection = firebase
      .firestore()
      .collection("users")
      .doc(user)
      .collection("liked_post");
    likedCollection
      .doc(postId)
      .delete()
      .then(() => {
        setFavState(false);
        selectedPost.style.display = "none";
        handleClose();
      });
  };

  const setFavDefault = () => {
    setFavState(true);
    favRef.current.firstChild.lastChild.firstChild.attributes.value =
      favLikedIcon;
    favRef.current.firstChild.lastChild.firstChild.style.fill = "red";
  };

  return (
    <div className={classes.root1}>
      <Navigation />
      <div className={classes.root}>
        <Typography align="center" className={classes.ty} variant="h4">
          MY FAVORITES
        </Typography>
        <React.Fragment>
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
            onLoad={setFavDefault}
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
                    title={profile.username}
                  />
                  <CardMedia
                    className={classes.media}
                    image={user_post.imageURL}
                  />
                  <CardContent>
                    <Checkbox
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite />}
                      name="checkedH"
                      color="primary"
                      onClick={likeHandler}
                      ref={favRef}
                      checked={favState}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {user_post.caption}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </Fade>
          </Modal>
        </React.Fragment>
      </div>
    </div>
  );
}
