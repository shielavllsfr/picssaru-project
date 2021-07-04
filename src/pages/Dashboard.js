import React, { useState, useEffect, useRef } from "react";
import Navigation from "../components/Navigation";
import firebase from "../utils/firebase";
import {
  makeStyles,
  Avatar,
  IconButton,
  Button,
  TextareaAutosize,
  Grid,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { auto } from "async";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

export default function Dashboard() {
  const db = firebase.firestore();
  const [user, setUser] = useState({ email: "" });
  const [image, setImage] = useState({ selectedImage: null });
  const [path, setPath] = useState({ imagePath: "" });
  const [caption, setCaption] = useState({ postCaption: "" });
  const [userPost, setPost] = useState({ post_data: [] });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openContext = Boolean(anchorEl);
  const options = ["Edit", "Delete"];
  const ITEM_HEIGHT = 48;

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
    root: {
      minWidth: "30%",
      maxWidth: "40%",
      marginLeft: "30%",
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

    console.log(event.target.files[0]);

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
    // console.log(this.state.image);
    let file = image;
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var uploadTask = storageRef.child("folder/" + file.name).put(file);

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
            .add({ imageURL: url, caption: caption })
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
    };
    fetchData();
  }, []);

  const deletePost = (postId) => {
    db.collection("users")
      .doc(user.uid)
      .collection("user_post")
      .doc(postId)
      .delete()
      .then(() => {
        //success
        console.log("deleted");
      })
      .catch((error) => {
        //error
        console.log(error);
      });
  };

  const handleContextClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (anchorEl != null) {
      if (event.currentTarget.tabIndex == 0) {
        console.log("delete");
      } else if (event.currentTarget.tabIndex == -1) {
        //edit
        console.log("edit");
      }
    }
  };

  const handleContextClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Navigation />
      <Button type="button" onClick={handleOpen}>
        <Avatar alt={user.email} src="/static/images/avatar/1.jpg" />
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

            <Grid>
              {/* DITO MAGDIDISPLAY YUNG IUUPLOAD NA IMAGE */}

              <img src={path} alt="image" height="70%" width="80%" />
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
      <Card className={classes.root}>
        {userPost.post_data.map((post) => (
          <CardActionArea key={post.id}>
            <CardMedia component="img" height="500" image={post.imageURL} />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {post.caption}
              </Typography>

              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleContextClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={openContext}
                onClose={handleContextClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: "20ch",
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option}
                    selected={option}
                    onClick={handleContextClick}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </CardContent>
          </CardActionArea>
        ))}
      </Card>
    </div>
  );
}
