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

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [matricyear, setMatricyear] = useState("");
  const [gradyear, setGradyear] = useState("");

  const userRef = doc(db, "Users", auth.currentUser.uid)

  const getInfo = async () => {
    const docu = await getDoc(userRef);
    const userData = docu.data();
    setUsername(userData.username);
    setEmail(userData.email);
    setFaculty(userData.faculty);
    setCourse(userData.course);
    setMatricyear(userData.matricyear);
    setGradyear(userData.gradyear);
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
        <form>
          <label>Username:</label>
          <input 
          type="text" 
          value={username}
          ></input><br></br>

          <label>Email:</label>
          <input 
          type="text" 
          value={email}
          ></input><br></br>

          <label>Faculty:</label>
          <input 
          type="text" 
          value={faculty}
          ></input><br></br>

          <label>Course:</label>
          <input 
          type="text" 
          value={course}
          ></input><br></br>

          <label>Matriculation Year:</label>
          <input 
          type="text" 
          value={matricyear}
          ></input><br></br>

          <label>Graduation Year:</label>
          <input 
          type="text" 
          value={gradyear}
          ></input><br></br>
        </form>
      </div>
      <button>
        Update Profile
      </button>
      <div>
        <button variant="link" onClick={handleLogout}>Log Out </button>
      </div>


    </>
  )
}