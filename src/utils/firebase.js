import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDLXPsCNNoZ9mwwNK-RlUIlMtEwuRsulow",
  authDomain: "picssaru-bsit3d-project.firebaseapp.com",
  projectId: "picssaru-bsit3d-project",
  storageBucket: "picssaru-bsit3d-project.appspot.com",
  messagingSenderId: "1029053723405",
  appId: "1:1029053723405:web:7f5ace31b1566ba36ab644",
  measurementId: "G-WG8K883B5P",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
