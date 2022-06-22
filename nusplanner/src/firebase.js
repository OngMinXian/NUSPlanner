import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const app = firebase.initializeApp({
// apiKey: process.env.REACT_APP_FIREBASE_API_KEY,

// authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,

// projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,

// storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
// messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,

// appId: process.env.REACT_APP_FIREBASE_APP_ID,

// measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// })

const firebaseConfig = {
  apiKey: "AIzaSyBeJmFpYb7eufPfTnLgDNheYeRpq3utSGY",
  authDomain: "auth-development-71ec2.firebaseapp.com",
  databaseURL: "https://auth-development-71ec2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "auth-development-71ec2",
  storageBucket: "auth-development-71ec2.appspot.com",
  messagingSenderId: "1022464777549",
  appId: "1:1022464777549:web:406f6fde20102661386b04",
  measurementId: "G-VB319LE5JP"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app









