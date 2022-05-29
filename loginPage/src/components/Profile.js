import { React, useState, useEffect } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "./contexts/AuthContext"
import SideBar from './Sidebar.js';
import { db, auth, storage } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"

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

  const [img, setImg] = useState(null);
  const [imgurl, setImgurl] = useState("");

  const userRef = doc(db, "Users", auth.currentUser.uid)
  const imgListRef = ref(storage, `profilePics/${auth.currentUser.uid}`)

  const getInfo = async () => {
    const docu = await getDoc(userRef);
    const userData = docu.data();
    setUsername(userData.username);
    setEmail(userData.email);
    setFaculty(userData.faculty);
    setCourse(userData.course);
    setMatricyear(userData.matricyear);
    setGradyear(userData.gradyear);

    listAll(imgListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImgurl(url);
        })
      })
    })

  }

  const handleChange = async (e) => {
    e.preventDefault();
    await updateDoc(userRef, 
      {
        username: username,
        email: email,
        faculty: faculty,
        course: course,
        matricyear: matricyear,
        gradyear: gradyear,
      }
    );
    window.location.reload(false);
  }

  const editProfilePic = async () => {
    if (img == null) { return; }
      const imgRef = ref(storage, `profilePics/${auth.currentUser.uid}/profilepic`);
      await uploadBytes(imgRef, img);
      window.location.reload(false);  
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
      <img src={imgurl} style={{height:"300px", width:"300px" }}/>
      <div>
        <form onSubmit={handleChange}>
          <label>Username:</label>
          <input 
          type="text" 
          value={username}
          onChange={(event) => {setUsername(event.target.value); }}
          ></input><br></br>

          <label>Email:</label>
          <input 
          type="text" 
          value={email}
          onChange={(event) => {setEmail(event.target.value); }}
          ></input><br></br>

          <label>Faculty:</label>
          <input 
          type="text" 
          value={faculty}
          onChange={(event) => {setFaculty(event.target.value); }}
          ></input><br></br>

          <label>Course:</label>
          <input 
          type="text" 
          value={course}
          onChange={(event) => {setCourse(event.target.value); }}
          ></input><br></br>

          <label>Matriculation Year:</label>
          <input 
          type="text" 
          value={matricyear}
          onChange={(event) => {setMatricyear(event.target.value); }}
          ></input><br></br>

          <label>Graduation Year:</label>
          <input 
          type="text" 
          value={gradyear}
          onChange={(event) => {setGradyear(event.target.value); }}
          ></input><br></br>

          <button type="submit">Update Profile</button><br></br>
        </form>
      </div>
      <div>
        <input type="file" onChange={(event) => {setImg(event.target.files[0])}}></input>
        <button onClick={editProfilePic}>Edit Profile Picture</button>
      </div>
      <div>
        <button variant="link" onClick={handleLogout}>Log Out </button>
      </div>


    </>
  )
}