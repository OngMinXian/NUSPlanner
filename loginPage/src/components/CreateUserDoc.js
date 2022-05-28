import React, { useEffect } from 'react'
import { db, auth } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, setDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom"

function CreateUserDoc() {

    const location = useLocation();
    const users = collection(db, "Users");
    const navigate = useNavigate()

    const createUser = async () => {
        await setDoc(doc(db, "Users", auth.currentUser.uid), 
        {
            username: location.state.usernameProp,
            email: location.state.emailProp,
            picture: "-",
            faculty: "-",
            course: "-",
            matricyear: "-",
            gradyear: "-",
        }) 
      };

    useEffect(() => {
        return () => {
            createUser();
            navigate("/");
          }       
    }, [])

  return (
    <>
    </>
  )
}

export default CreateUserDoc