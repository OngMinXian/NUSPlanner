// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdQUaYzbFhqHJ2_9Iddi9XA09ADL3to1M",
  authDomain: "nusplanner-668e2.firebaseapp.com",
  projectId: "nusplanner-668e2",
  storageBucket: "nusplanner-668e2.appspot.com",
  messagingSenderId: "420532652154",
  appId: "1:420532652154:web:dd990bccc1fb91b264d3c3",
  measurementId: "G-NLM9BMQ7DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();