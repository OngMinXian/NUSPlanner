import React, { useEffect, useState } from 'react'
import { db, auth, storage } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, setDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom"
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"
import dp from "../images/defaultProfilePic.jpg"

function CreateUserDoc() {

    const location = useLocation();
    const users = collection(db, "Users");
    const navigate = useNavigate()
    const [img, setImg] = useState(null);

    const createUser = async () => {
        await setDoc(doc(db, "Users", auth.currentUser.uid), 
        {
            username: location.state.usernameProp,
            email: location.state.emailProp,
            faculty: "-",
            course: "-",
            matricyear: "-",
            gradyear: "-",
        }) 
      };

    const createProfilePic = async () => {
      const imgRef = ref(storage, `profilePics/${auth.currentUser.uid}/profilepic`);
      await uploadBytes(imgRef, dp);
    }

    useEffect(() => {
        return () => {
            createUser();
            createProfilePic();
            navigate("/");
          }       
    }, [])

  return (
    <>
    </>
  )
}

export default CreateUserDoc