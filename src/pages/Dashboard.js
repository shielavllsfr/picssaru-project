/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import firebase from "../utils/firebase";
import ImportImage from "../img/ImportImage";

/* THEME */
import {
  makeStyles,
  Avatar,
  IconButton,
  Button,
  TextareaAutosize,
  Grid,
  Checkbox,
  Modal,
  Backdrop,
  Fade,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  MenuItem,
  Menu,
  TextField,
} from "@material-ui/core";

/* ICONS */
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";
import reactDom from "react-dom";

export default function Dashboard() {
  const db = firebase.firestore();
  const [user, setUser] = useState({ email: "" });
  const [image, setImage] = useState({ selectedImage: null });
  const [path, setPath] = useState({ imagePath: "" });
  const [caption, setCaption] = useState({ postCaption: "" });
  const [userPost, setPost] = useState({ post_data: [] });
  const [postRef, setPostRef] = useState();
  const favDefIcon =
    "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z";
  const favLikedIcon =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  useEffect(() => {
    var user = firebase.auth().currentUser;
    if (user) {
      setUser(user);
      setPath(
        "https://icsb.org/wp-content/uploads/membership-profile-uploads/profile_image_placeholder.png"
      );
    } else {
    }
  }, []);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url(${ImportImage.bgNewsfeed})`,
      backgroundPosition: "center center",
      backgroundSize: "cover",
      border: "none",
      boxShadow: "none",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      maxHeight: "107%",
      minHeight: "107%",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      minWidth: "40%",
      maxWidth: "40%",
      maxHeight: "60%",
      minHeight: "60%",
    },
    uploadImages: {
      minWidth: "60%",
      maxWidth: "60%",
      marginBottom: "2%",
      marginTop: "2%",
    },
    media: {
      height: 0,
      paddingTop: "56.25%",
    },
    upload: {
      height: "70%",
      width: "80%",
    },
    box: {
      backgroundColor: "white",
    },
    typo: {
      marginTop: "2.25rem !important",
      marginBottom: "0.25rem !important",
      fontWeight: "bolder",
      textAlign: "center",
    },
    but: {
      marginBottom: "2rem !important",
      marginLeft: "21rem !important",
    },
    cardComment: {
      alignItems: "left",
      textTransform: "lowercase",
      textAlign: "left",
      justifyItems: "left",
      border: "none",
      boxShadow: "none",
    },
    txtAdd: {
      alignItems: "left",
      textTransform: "lowercase",
      textAlign: "left",
      justifyItems: "left",
      fontSize: "13px",
    },
    comAdd: {
      marginTop: "1.25rem !important",
      width: "650px",
    },
    comAdd1: {
      marginTop: ".70rem !important",
      width: "95px",
      height: "55px",
    },
    uploadcard: {
      marginTop: "1.70rem !important",
      width: "805px",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "1.70rem !important",
    },
  }));

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCaption = (e) => {
    setCaption(e.target.value);
  };

  const selectedImageHandler = (event) => {
    setImage(event.target.files[0]);
    if (event.target.files[0] !== undefined) {
      var file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPath(reader.result);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  const uploadHandler = () => {
    console.log(image);
    let file = image;
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var uploadTask = storageRef
      .child("folder/" + user.uid + " post/" + file.lastModified)
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
          console.log(url);

          db.collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("user_post")
            .add({
              imageURL: url,
              caption: caption,
              imageName: file.lastModified,
              created_at: new Date(),
            })
            .then(() => {
              db.collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({ exists: "yes" })
                .then(() => {
                  console.log("asd");
                  window.location.reload();
                });

              handleClose();
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    );
  };

  const [profile, setProfile] = useState({
    username: "",
  });

  useEffect(() => {
    const fetchData = () => {
      let user_post = [];
      setCaption("");
      db.collection("users").onSnapshot((users) => {
        users.forEach((user) => {
          db.collection("users")
            .doc(user.id)
            .collection("user_post")
            .orderBy("created_at", "desc")
            .onSnapshot((doc) => {
              doc.forEach((post) => {
                let post_comment = [];

                db.collection("users")
                  .doc(user.id)
                  .collection("user_post")
                  .doc(post.id)
                  .collection("comments")
                  .orderBy("created_at", "asc")
                  .get()
                  .then((comments) => {
                    comments.forEach((comment) => {
                      post_comment.push({
                        user_comment: comment.data().comment,
                        username: comment.data().username,
                      });
                    });
                  });
                db.collection("users")
                  .doc(user.id)
                  .collection("profile_info")
                  .onSnapshot((profiles) => {
                    profiles.forEach((profile) => {
                      user_post.push({
                        ...post.data(),
                        id: post.id,
                        username: profile.data().info_changes.username,
                        profileURL: profile.data().info_changes.profileURL,
                        user_id: user.id,
                        comments: post_comment,
                      });
                    });
                    setPost({ post_data: user_post });
                  });
              });
            });
        });
      });
      const currentUser = firebase.auth().currentUser;

      db.collection("users")
        .doc(currentUser.uid)
        .collection("profile_info")
        .get()
        .then((profile_info) => {
          profile_info.forEach((user) => {
            setProfile({
              username: user.data().info_changes.username,
            });
          });
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleContextClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPostRef(
      event.currentTarget.parentElement.parentElement.parentElement
        .parentElement
    );
  };

  const handleContextClose = () => {
    setAnchorEl(null);
  };

  const hidePostHandler = () => {
    console.log(postRef);
    handleContextClose();
    postRef.style.display = "none";
  };

  const likeHandler = (event) => {
    const postId =
      event.target.parentElement.parentElement.parentElement.parentElement.id;
    const userId =
      event.target.parentElement.parentElement.parentElement.parentElement
        .firstChild.id;

    const postCollection = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("user_post");

    const likedCollection = firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("liked_post");

    if (event.target.checked) {
      postCollection
        .doc(postId)
        .get()
        .then((postData) => {
          const likedPost = {
            postId: postId,
            imageURL: postData.data().imageURL,
            caption: postData.data().caption,
            userId: userId,
          };
          likedCollection.add(likedPost);

          event.target.parentElement.lastChild.firstChild.attributes[0].value =
            favLikedIcon;
          event.target.parentElement.lastChild.firstChild.style.fill = "red";
        });
    } else {
      likedCollection.get().then((likes) => {
        likes.forEach((post) => {
          if (post.data().postId === postId) {
            likedCollection.doc(post.id).delete();
            event.target.parentElement.lastChild.firstChild.attributes[0].value =
              favDefIcon;
            event.target.parentElement.lastChild.firstChild.style.fill = "";
          }
        });
      });
    }
  };

  const setFavState = (event) => {
    const favButton =
      event.target.parentElement.parentElement.parentElement.parentElement
        .children[2].firstChild.firstChild.firstChild;
    const postCard =
      event.target.parentElement.parentElement.parentElement.parentElement;
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("liked_post")
      .get()
      .then((doc) => {
        doc.forEach((post) => {
          if (postCard.id === post.data().postId) {
            console.log("matched on " + post.data().postId);
            favButton.checked = true;
            postCard.children[2].firstChild.firstChild.lastChild.firstChild.attributes[0].value =
              favLikedIcon;
            postCard.children[2].firstChild.firstChild.lastChild.firstChild.style.fill =
              "red";
          }
        });
      });
  };

  const [payload, setPayload] = useState({
    task: "",
  });

  const addTask = (event) => {
    console.log(userPost.post_data);
    const postId =
      event.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.parentElement;
    const userId = postId.firstChild;
    const commentInputRef =
      event.target.parentElement.parentElement.parentElement.firstChild
        .lastChild.firstChild;
    const commentContainerRef =
      event.target.parentElement.parentElement.parentElement.parentElement
        .firstChild;

    let postComments = [];

    db.collection("users")
      .doc(userId.id)
      .collection("user_post")
      .doc(postId.id)
      .collection("comments")
      .add({
        comment: payload.task,
        created_at: new Date(),
        postId: postId.id,
        userId: userId.id,
        username: profile.username,
      })
      .then((docRef) => {
        console.log("saved");
        commentInputRef.value = "";

        for (let i = 0; i < commentContainerRef.children.length; i++) {
          const newComment = (
            <Typography variant="h6" component={Button}>
              {
                commentContainerRef.children[i].firstChild.firstChild
                  .textContent
              }
            </Typography>
          );
          postComments.push(newComment);
        }

        postComments.push(
          <Typography variant="h6" component={Button}>
            {payload.task}
          </Typography>
        );
        console.log("aa");
        reactDom.render(postComments, commentContainerRef);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    setPayload({ task: e.target.value });
  };

  return (
    <div>
      <Navigation />
      <Card className={classes.root}>
        <Card className={classes.uploadcard}>
          <Typography variant="h5" className={classes.typo}>
            MAKE YOUR WORLD BRIGHTER!
          </Typography>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleOpen}
            className={classes.but}
          >
            <PublishIcon />
            POST NOW
          </Button>
        </Card>
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
              <h2 id="transition-modal-title">Create New Post</h2>
              <p id="transition-modal-description"></p>
              <Grid>
                <IconButton variant="contained" component="label">
                  <input type="file" hidden onChange={selectedImageHandler} />
                  <AddAPhotoIcon />
                </IconButton>
              </Grid>

              <Grid className={classes.box}>
                <img src={path} alt="image" className={classes.upload} />
              </Grid>

              <Grid>
                <TextareaAutosize
                  rowsMax={4}
                  aria-label="maximum height"
                  placeholder="Write a Caption"
                  onChange={handleCaption}
                />
              </Grid>
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                onClick={uploadHandler}
              >
                Upload
              </Button>
            </div>
          </Fade>
        </Modal>
        {userPost.post_data.map((post) => (
          <Card
            className={classes.uploadImages}
            key={post.id}
            id={post.id}
            onLoad={setFavState}
          >
            <CardHeader
              id={post.user_id}
              avatar={
                <Avatar
                  className={classes.avatar}
                  src={post.profileURL}
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
                    <MenuItem onClick={hidePostHandler}>Hide Post</MenuItem>
                  </Menu>
                </Grid>
              }
              title={post.username}
            />
            <CardMedia className={classes.media} image={post.imageURL} />
            <CardContent>
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                name="checkedH"
                color="primary"
                onClick={likeHandler}
              />
              <Typography variant="body2" color="textSecondary" component="p">
                {post.caption}
              </Typography>
              <Card className={classes.cardComment}>
                <CardContent>
                  <Grid
                    container
                    direction="column"
                    alignItems="left"
                    justify="left"
                  >
                    {post.comments.map((comment) => (
                      <React.Fragment>
                        <Grid container className={classes.txtAdd}>
                          <Typography className={classes.txtAdd}>
                            {comment.username}: {comment.user_comment}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                  <Grid container spacing={2}>
                    <TextField
                      variant="outlined"
                      placeholder="Add Comment...."
                      onChange={handleChange}
                      className={classes.comAdd}
                    />
                    <Grid item>
                      <Button
                        className={classes.comAdd1}
                        variant="contained"
                        color="primary"
                        onClick={addTask}
                      >
                        ADD
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        ))}
      </Card>
    </div>
  );
}
