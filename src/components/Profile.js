import { React, useState, useEffect } from 'react'
import { Image, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "./contexts/AuthContext"
import SideBar from './Sidebar.js';
import { db, auth, storage } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"
import "./CSS/profile.css"

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

  const userRef = doc(db, "Users", auth.currentUser.uid);
  const imgDefault = ref(storage, `profilePics/Default`);
  const imgListRef = ref(storage, `profilePics/${auth.currentUser.uid}`);

  const getInfo = async () => {
    const docu = await getDoc(userRef);
    const userData = docu.data();
    setUsername(userData.username);
    setEmail(userData.email);
    setFaculty(userData.faculty);
    setCourse(userData.course);
    setMatricyear(userData.matricyear);
    setGradyear(userData.gradyear);

    if (!userData.picSet) {
      await listAll(imgDefault).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImgurl(url);
          })
        })
      })
    }
    else {
      await listAll(imgListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImgurl(url);
          })
        })
      })
    }

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
    await updateDoc(userRef, {picSet: true})
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

  useEffect(() => {
    return () => {
      getInfo();
    }
  }, [])

  return (
    <>
      <SideBar></SideBar>
      {error && <Alert variant="danger"> {error} </Alert>}
      <Image src={imgurl} className="rounded-circle center-block" />
      <br></br>
      <div className = "center-div" >
        <h1 className = "center-with-padding"> Profile Picture </h1>
      </div>

      <div className = "edit-profile-div">
        <input type="file" 
        onChange={(event) => { setImg(event.target.files[0]) }}></input>
        <button onClick={editProfilePic} >Confirm Changes</button>
      </div>

      <div className = "center-div">

        <form onSubmit={handleChange}>
          <table>
            <tr>
              <td> <b> Username: </b> </td>
              <td> <input
                type="text"
                className = "table-bottom"
                value={username}
                onChange={(event) => { setUsername(event.target.value); }}
              ></input> </td> <br></br>
            </tr>

            <tr>
              <td> <b> Email: </b> </td>
              <td> <input
                className = "table-bottom"
                type="text"
                value={email}
                onChange={(event) => { setEmail(event.target.value); }}
              ></input></td><br></br>
            </tr>

            <tr>
              <td> <b> Faculty: </b> </td>
              <td> <input
                className = "table-bottom"
                type="text"
                value={faculty}
                onChange={(event) => { setFaculty(event.target.value); }}
              ></input></td><br></br>
            </tr>

            <tr>
              <td> <b> Course: </b> </td>
              <td> <input
                className = "table-bottom"
                type="text"
                value={course}
                onChange={(event) => { setCourse(event.target.value); }}
              ></input></td><br></br>
            </tr>

            <tr>
              <td> <b> Matriculation Year: </b> </td>
              <td> <input
                className = "table-bottom"
                type="text"
                value={matricyear}
                onChange={(event) => { setMatricyear(event.target.value); }}
              ></input> </td> <br></br>
            </tr>

            <tr>
              <td> <b> Graduation Year: </b> </td>
              <td> <input
                className = "table-bottom"
                type="text"
                value={gradyear}
                onChange={(event) => { setGradyear(event.target.value); }}
              ></input></td><br></br>
            </tr>
            <br></br>
          </table>
        </form>
      </div>

      <button type="submit" 
      className = "center-single-button"
      onClick={handleChange}
      >Update Profile</button><br></br>

      <div>
        <button variant="link" 
        className = "center-single-button" 
        onClick={handleLogout}>Log Out </button>
      </div>

    </>
  )
}