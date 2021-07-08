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
} from "@material-ui/core";

/* ICONS */
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";

export default function Dashboard() {
  const db = firebase.firestore();
  const [user, setUser] = useState({ email: "" });
  const [image, setImage] = useState({ selectedImage: null });
  const [path, setPath] = useState({ imagePath: "" });
  const [caption, setCaption] = useState({ postCaption: "" });
  const [userPost, setPost] = useState({ post_data: [] });
  const [profile, setProfile] = useState();
  const [username, setUsername] = useState();
  const [postRef, setPostRef] = useState();

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
    divv: {
      backgroundImage: `url(${ImportImage.divBg})`,
      height: "100vh",
      backgroundPosition: "center center",
      backgroundSize: "cover",
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
      maxHeight: "60%",
      minHeight: "60%",
    },
    uploadImages: {
      minWidth: "30%",
      maxWidth: "40%",
      marginBottom: "2%",
      marginTop: "2%",
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
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
    },
    up: {
      marginBottom: "2rem !important",
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
        // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          db.collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("user_post")
            .add({
              imageURL: url,
              caption: caption,
              imageName: file.lastModified,
            })
            .then(() => {
              handleClose();
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    );
  };

  useEffect(() => {
    const fetchData = () => {
      const currentUser = firebase.auth().currentUser;

      db.collection("users")
        .doc(currentUser.uid)
        .collection("user_post")
        .onSnapshot((doc) => {
          let user_post = [];
          doc.forEach((post) => {
            user_post.push({ ...post.data(), id: post.id });
          });
          setPost({ post_data: user_post });
        });

      db.collection("users")
        .doc(currentUser.uid)
        .collection("profile_info")
        .get()
        .then((profile_info) => {
          profile_info.forEach((user) => {
            setProfile(user.data().info_changes.profileURL);
            setUsername(user.data().info_changes.username);
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

  return (
    <div className={classes.divv}>
      <Navigation />
      <Card className={classes.root}>
        <Typography variant="h5" className={classes.typo}>
          MAKE YOUR PAGE BRIGHTER, UPLOAD NOW!
        </Typography>
        <Button
          className={classes.up}
          type="button"
          variant="contained"
          color="default"
          onClick={handleOpen}
        >
          <PublishIcon />
          UPLOAD
        </Button>
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
          <Card className={classes.uploadImages} key={post.id} id={post.id}>
            <CardHeader
              avatar={
                <Avatar className={classes.avatar} src={profile}></Avatar>
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
              title={username}
            />
            <CardMedia className={classes.media} image={post.imageURL} />
            <CardContent>
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                name="checkedH"
                color="primary"
              />
              <Typography variant="body2" color="textSecondary" component="p">
                {post.caption}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Card>
    </div>
  );
}
