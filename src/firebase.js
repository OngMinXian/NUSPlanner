import firebase from 'firebase/compat/app'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBeJmFpYb7eufPfTnLgDNheYeRpq3utSGY",
    authDomain: "auth-development-71ec2.firebaseapp.com",
    databaseURL: "https://auth-development-71ec2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "auth-development-71ec2",
    storageBucket: "auth-development-71ec2.appspot.com",
    messagingSenderId: "1022464777549",
    appId: "1:1022464777549:web:50adc0a5df3589f3386b04",
    measurementId: "G-K4HSK43RRS"
  };
  
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app





