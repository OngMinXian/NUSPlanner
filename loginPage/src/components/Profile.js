import { React, useState, useEffect } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "./contexts/AuthContext"
import SideBar from './Sidebar.js';
import { db, auth } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, getDoc } from "firebase/firestore";

export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUsers] = useState();
  

  const userRef = doc(db, "Users", auth.currentUser.uid)

  const getInfo = async () => {
    const temp = await getDoc(userRef);
    console.log(temp.id);
    console.log(temp.data());
  }

  async function handleLogout() {
    setError('')
    try {
      await logout()
      navigate('/login')
    } catch {
      setError('Failed to log out')
    }
  }

  useEffect (() => {
    return () => {
      getInfo();
    }  
  }, [])

  return (
    <>
      <SideBar></SideBar>      
      {error && <Alert variant="danger"> {error} </Alert>}
      <div>
        <h2></h2>
        <h2></h2>
        <h2></h2>
        <h2></h2>
        <h2></h2>
      </div>
      <Link to="/update-profile">
        Update Profile
      </Link>
      <div>
        <button variant="link" onClick={handleLogout}>Log Out </button>
      </div>


    </>
  )
}