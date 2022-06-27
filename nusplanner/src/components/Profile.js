import { React, useState, useEffect } from 'react'
import { Image, Tab, Tabs, Form, Row, Col, Container, Button, Alert } from 'react-bootstrap'
import SideBar from './Sidebar.js';
import { db, auth, storage } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"
import "./CSS/profile.css"
import EditModAndCap from "./EditModAndCap.js"

export default function Profile() {
  const [error, setError] = useState("")

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [matricyear, setMatricyear] = useState("");
  const [gradyear, setGradyear] = useState("");

  const [img, setImg] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgurl, setImgurl] = useState("");

  //For module code validation 
  const [validated, setValidated] = useState(false)

  //For tab selection
  const [key, setKey] = useState('')

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
    setKey(userData.profileLastLeftOff);

    if (!userData.picSet) {
      await listAll(imgDefault).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImgurl(url);
            setImgLoaded(true);
          })
        })
      })
    }
    else {
      await listAll(imgListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImgurl(url);
            setImgLoaded(true);
          })
        })
      })
    }

  }

  const handleChange = async (e) => {
    e.preventDefault();
    const form = e.currentTarget
    setValidated(true)
    if (form.checkValidity() === false) {
      window.confirm("incorrect inputs were given")
      e.preventDefault()
      e.stopPropagation()
    }
    try {
      await updateDoc(userRef,
        {
          username: username,
          email: email,
          faculty: faculty,
          course: course,
          matricyear: matricyear,
          gradyear: gradyear,
        }
      )
      window.alert("Changes Saved!")
    } catch {
      console.log("failed")
    };
  }

  const editProfilePic = async () => {
    if (img == null) { return; }
    const imgRef = ref(storage, `profilePics/${auth.currentUser.uid}/profilepic`);
    await uploadBytes(imgRef, img);
    await updateDoc(userRef, { picSet: true })
    window.location.reload(false);
  }

  useEffect(() => {
    getInfo();
  }, [])

  useEffect(() => {
    if (key !== "") {
      updateDoc(userRef, { profileLastLeftOff: key });
    }
  }, [key])

  return (
    <>
      <SideBar></SideBar>

      <div className="top-spacing"></div>
      <Container>
        <Row>
          <Col xs={4}>
            {imgLoaded &&
              <Image src={imgurl} className="display-pic" />
            }
          </Col>

          <Col xs={5}>
            <Tabs
              activeKey={key}
              className="mb-3"
              onSelect={(k) => {
                setKey(k)
              }
              }
            >
              <Tab eventKey="uniSettings" title="Course Details">
                <EditModAndCap />
              </Tab>

              <Tab eventKey="accountSettings" title="Account Settings" width="600px">
                <div className="file-and-profile-div">
                  <input type="file"
                    className="file-input"
                    onChange={(event) => { setImg(event.target.files[0]) }}></input>

                  <Button onClick={editProfilePic}
                    className="confirm-image"
                    variant="outline-dark">Confirm Image</Button>
                </div>

                <Form noValidate validated={validated} onSubmit={handleChange}>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text" defaultValue={username} onChange={(event) => { setUsername(event.target.value); }} />
                      <Form.Control.Feedback type="invalid">Please provide a username</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" defaultValue={email} onChange={(event) => { setEmail(event.target.value); }} />
                      <Form.Control.Feedback type="invalid">Please provide a valid email</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Faculty</Form.Label>
                    <Form.Control type="text" pattern="[a-zA-Z][a-zA-Z ]+" defaultValue={faculty} onChange={(event) => { setFaculty(event.target.value); }} />
                    <Form.Control.Feedback type="invalid">Please provide a valid faculty name</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Course</Form.Label>
                    <Form.Control type="text" pattern="[a-zA-Z][a-zA-Z ]+" defaultValue={course} onChange={(event) => { setCourse(event.target.value); }} />
                    <Form.Control.Feedback type="invalid">Please provide a valid course name</Form.Control.Feedback>
                  </Form.Group>

                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Matriculation Year</Form.Label>
                      <Form.Control type="text" pattern="^(19|20)\d{2}$" defaultValue={matricyear}
                        onChange={(event) => { setMatricyear(event.target.value); }} />
                      <Form.Control.Feedback type="invalid">Please provide a valid year</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Graduation Year</Form.Label>
                      <Form.Control type="text" pattern="^(19|20)\d{2}$" defaultValue={gradyear} onChange={(event) => { setGradyear(event.target.value); }} />
                      <Form.Control.Feedback type="invalid">Please provide a valid year</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <div className="confim-profile-update ">
                    <Button type="submit" variant="outline-primary"
                      onClick={handleChange}
                    >Update Profile</Button>
                  </div>
                </Form>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  )
}