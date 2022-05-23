// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbS1Ggv4L0zzNpTq0OljgGIXSSqSXj85k",
  authDomain: "nusplanner-771d3.firebaseapp.com",
  projectId: "nusplanner-771d3",
  storageBucket: "nusplanner-771d3.appspot.com",
  messagingSenderId: "537892466787",
  appId: "1:537892466787:web:ee79e425e38e035ccb8856",
  measurementId: "G-0KVNE51JPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();