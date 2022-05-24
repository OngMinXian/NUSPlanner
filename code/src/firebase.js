// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
  apiKey: "AIzaSyCdQUaYzbFhqHJ2_9Iddi9XA09ADL3to1M",
  authDomain: "nusplanner-668e2.firebaseapp.com",
  projectId: "nusplanner-668e2",
  storageBucket: "nusplanner-668e2.appspot.com",
  messagingSenderId: "420532652154",
  appId: "1:420532652154:web:dd990bccc1fb91b264d3c3",
  measurementId: "G-NLM9BMQ7DN"
});

export const auth = app.auth();
export const store = app.firestore();

export default app