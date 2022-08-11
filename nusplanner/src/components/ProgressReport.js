import React, { useState, useEffect } from 'react'
import SideBar from './Sidebar'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db, auth, storage } from '../firebase'
import './CSS/progressreport.css'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import {
  Button,
  Form,
  Row,
  Col,
  Container,
  Card,
  Image,
  Toast,
  ToastContainer
} from 'react-bootstrap'
import { BsEnvelope, BsTelephone, BsLinkedin, BsGlobe } from 'react-icons/bs'
import { GoLocation } from 'react-icons/go'
import { FaUniversity, FaGraduationCap, FaScroll } from 'react-icons/fa'
import { TbReportAnalytics } from 'react-icons/tb'
import { GiConfirmed } from 'react-icons/gi'

function ProgressReport () {
  // Get data from Firebase
  const userRef = doc(db, 'Users', auth.currentUser.uid)

  // Hook for success notification
  const [notifySaved, setNotifySaved] = useState(false)

  // Hooks for data retrieval
  const [name, setName] = useState('')
  const [gradYear, setGradYear] = useState('')
  const [faculty, setFaculty] = useState('')
  const [course, setCourse] = useState('')
  const [email, setEmail] = useState('')
  const [allMods, setAllMods] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [userLinkedin, setUserLinkedin] = useState('')
  const [userWebsite, setUserWebsite] = useState('')
  const [userDescription, setUserDescription] = useState('')

  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgurl, setImgurl] = useState('')
  const imgDefault = ref(storage, 'profilePics/Default')
  const imgListRef = ref(storage, `profilePics/${auth.currentUser.uid}`)

  const getAllData = async () => {
    const docu = await getDoc(userRef)

    setName(docu.data().username)
    setGradYear(docu.data().gradyear)
    setFaculty(docu.data().faculty)
    setCourse(docu.data().course)
    setEmail(docu.data().email)
    setAllMods(docu.data().modgradeinfo)
    setAllEvents(docu.data().events)
    setUserLinkedin(docu.data().linkedin)
    setUserWebsite(docu.data().website)
    setUserDescription(docu.data().selfdescription)

    if (!docu.data().picSet) {
      await listAll(imgDefault).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImgurl(url)
            setImgLoaded(true)
          })
        })
      })
    } else {
      await listAll(imgListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImgurl(url)
            setImgLoaded(true)
          })
        })
      })
    }
  }

  useEffect(() => {
    getAllData()
  }, [])

  // Cap calculator -- NEEDED IN FINAL VERS
  const calcOverallCAP = (arr) => {
    const gradeToCAP = {
      'A+': 5,
      A: 5,
      'A-': 4.5,
      'B+': 4,
      B: 3.5,
      'B-': 3,
      'C+': 2.5,
      C: 2,
      'D+': 1.5,
      D: 1,
      F: 0
    }
    let res = 0
    let count = 0
    arr.map((i) => {
      if (i.grade !== 'SU' && i.grade !== '' && i.grade !== 'Not taken') {
        count += 1
        res += gradeToCAP[i.grade]
      }
    })
    return (res / count).toFixed(2)
  }

  // Handle add LinkedIn, website, self description field to database
  const uploadItems = async (e) => {
    try {
      await updateDoc(userRef, {
        linkedin: userLinkedin,
        website: userWebsite,
        selfdescription: userDescription
      })
      setNotifySaved(true)
    } catch {
      console.log('failed')
    }
  }

  // Constants to output text and their subsitutues if no data is present
  const gradYearString =
    gradYear.length === 0
      ? 'Graduation year not stated'
      : `Class of ${gradYear}`
  const courseString =
    faculty.length === 0 || course.length === 0
      ? 'Missing fields for course and faculty'
      : `Faculty of ${faculty}, ${course}`
  const overallCAPString =
    calcOverallCAP(allMods) !== 'NaN'
      ? `${calcOverallCAP(allMods)} Cumulative Point Average`
      : 'Missing fields for modules and grades'

  // Work category
  const [workEvents, setWorkEvents] = useState([])
  useEffect(() => {
    allEvents.map((i) => {
      if (i.category === 'Work') {
        if (i.PR) {
          if (i.end.toDate() <= new Date() || i.start.toDate() <= new Date()) {
            setWorkEvents((workEvents) => [...workEvents, i])
          }
        }
      }
    })
  }, [allEvents])

  // Acads category
  const [acadEvents, setAcadEvents] = useState([])
  useEffect(() => {
    allEvents.map((i) => {
      if (i.category === 'Academics') {
        if (i.PR) {
          if (i.end.toDate() <= new Date() || i.start.toDate() <= new Date()) {
            setAcadEvents((acadEvents) => [...acadEvents, i])
          }
        }
      }
    })
  }, [allEvents])

  // CCA category
  const [ccaEvents, setCCAEvents] = useState([])
  useEffect(() => {
    allEvents.map((i) => {
      if (i.category === 'Extracurriculars') {
        if (i.PR) {
          if (i.end.toDate() <= new Date() || i.start.toDate() <= new Date()) {
            setCCAEvents((ccaEvents) => [...ccaEvents, i])
          }
        }
      }
    })
  }, [allEvents])

  return (
    <>
      <SideBar></SideBar>

      <div className="top-space"></div>
      <Container>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={4}>
                <Card className="custom-contact-bg">
                  <div className="small-space"></div>
                  <div className="center-dp">
                    {imgLoaded && (
                      <Image src={imgurl} className="display-pic" />
                    )}
                  </div>

                  <div className="pad-all-around">
                    <p className="resume-header">CONTACT</p> <br></br>
                    <div className="contact-field-style">
                      <BsEnvelope color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">{email}</span>
                    </div>
                    <div className="contact-field-style">
                      <BsTelephone color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">
                        <input
                          placeholder="Phone Number"
                          disabled
                          className="disabled-bg"
                        ></input>
                      </span>
                    </div>
                    <div className="contact-field-style">
                      <GoLocation color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">
                        <input
                          placeholder="Address"
                          disabled
                          className="disabled-bg"
                        ></input>
                      </span>
                    </div>
                    <div className="contact-field-style">
                      <BsLinkedin color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">
                        <input
                          placeholder="LinkedIn"
                          defaultValue={userLinkedin}
                          onBlur={(i) => {
                            setUserLinkedin(i.target.value)
                          }}
                        ></input>
                      </span>
                    </div>
                    <div className="contact-field-style">
                      <BsGlobe color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">
                        <input
                          placeholder="Personal Website"
                          defaultValue={userWebsite}
                          onBlur={(i) => {
                            setUserWebsite(i.target.value)
                          }}
                        ></input>
                      </span>
                    </div>
                    <div className="small-space"></div>
                    <p className="resume-header">EDUCATION</p> <br></br>
                    <div className="contact-field-style">
                      <FaUniversity color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">
                        National University of Singapore
                      </span>
                    </div>
                    <div className="contact-field-style">
                      <FaGraduationCap color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">{gradYearString}</span>
                    </div>
                    <div className="contact-field-style">
                      <TbReportAnalytics color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">{overallCAPString}</span>
                    </div>
                    <div className="contact-field-style">
                      <FaScroll color="white" fontSize="1.5em" />{' '}
                      <span className="emoji-space">{courseString}</span>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col>
                <Row>
                  <Card xs={8} className="custom-name-bg">
                    <div className="text-center">
                      <h1 className="name-header">{name}</h1>
                    </div>

                    <div className="text-center">
                      <p className="role-header">
                        Student, National University of Singapore
                      </p>
                    </div>
                  </Card>
                </Row>

                <Row>
                  <div className="small-space"></div>
                  <div className="position-summary-header">
                    <div className="role-details-div">
                      <p className="resume-header-dark">SUMMARY</p>
                      <div>
                        <Button onClick={uploadItems} variant="outline-danger">
                          Save Report
                        </Button>
                      </div>
                    </div>

                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        placeholder="A short description of your skills and positive attributes here"
                        defaultValue={userDescription}
                        onBlur={(i) => setUserDescription(i.target.value)}
                        rows={3}
                      />
                    </Form.Group>
                  </div>
                </Row>

                <Row>
                  <div className="position-sub-header">
                    <p className="resume-header-no-space">EXPERIENCE</p>
                  </div>

                  {workEvents
                    .sort((first, second) => {
                      const startDiff = first.start - second.start
                      const endDiff = first.end - second.end
                      return endDiff !== 0 ? -endDiff : -startDiff
                    })
                    .map((event) => {
                      // get correct string for start date
                      const startMonth = event.start
                        .toDate()
                        .toLocaleString('default', { month: 'long' })
                      const startYear = event.start.toDate().getFullYear()
                      const startString = `${startMonth} ${startYear}`

                      // get correct string for end date
                      const endMonth = event.end
                        .toDate()
                        .toLocaleString('default', { month: 'long' })
                      const endYear = event.end.toDate().getFullYear()
                      const checkPresent = event.end.toDate() >= new Date()
                      const endString = checkPresent
                        ? 'Present'
                        : `${endMonth} ${endYear}`

                      // get correct organisation role
                      const eventOrgRole =
                        event.orgRole.length === 0
                          ? 'Role in event is not specified'
                          : event.orgRole
                      // get correct organisation name
                      const eventOrgName =
                        event.orgName.length === 0
                          ? 'Organisation associated with event is not specified'
                          : event.orgName
                      // get correct event description
                      const eventDescString =
                        event.description.length === 0
                          ? 'Event description is not specified'
                          : event.description

                      return (
                        <div className="role-content-div">
                          <div className="role-details-div">
                            <div>
                              <b>{eventOrgRole}</b> <br></br>{' '}
                              <p className="reduce-p-spacing">{eventOrgName}</p>
                              <ul>
                                <li>{eventDescString}</li>
                              </ul>
                            </div>
                            {startString !== endString
                              ? (
                              <p>
                                <b>{`${startString} - ${endString}`}</b>
                              </p>
                                )
                              : (
                              <p>
                                <b>{`${startString}`}</b>
                              </p>
                                )}
                          </div>
                        </div>
                      )
                    })}
                </Row>

                <div className="small-space"></div>
                <Row>
                  <div className="position-sub-header">
                    <p className="resume-header-no-space">EDUCATION</p>
                  </div>

                  {acadEvents
                    .sort((first, second) => {
                      const startDiff = first.start - second.start
                      const endDiff = first.end - second.end
                      return endDiff !== 0 ? -endDiff : -startDiff
                    })
                    .map((event) => {
                      // get correct string for start date
                      const startMonth = event.start
                        .toDate()
                        .toLocaleString('default', { month: 'long' })
                      const startYear = event.start.toDate().getFullYear()
                      const startString = `${startMonth} ${startYear}`

                      // get correct string for end date
                      const endMonth = event.end
                        .toDate()
                        .toLocaleString('default', { month: 'long' })
                      const endYear = event.end.toDate().getFullYear()
                      const checkPresent = event.end.toDate() >= new Date()
                      const endString = checkPresent
                        ? 'Present'
                        : `${endMonth} ${endYear}`

                      // get correct event title
                      const eventTitleString =
                        event.title.length === 0
                          ? 'Event title is not specified'
                          : event.title
                      // get correct event description
                      const eventDescString =
                        event.description.length === 0
                          ? 'Event description is not specified'
                          : event.description

                      return (
                        <div className="role-content-div">
                          <div className="role-details-div">
                            <div>
                              <b>{eventTitleString}</b> <br></br>
                              <ul>
                                <li>{eventDescString}</li>
                              </ul>
                            </div>
                            {startString !== endString
                              ? (
                              <p>
                                <b>{`${startString} - ${endString}`}</b>
                              </p>
                                )
                              : (
                              <p>
                                <b>{`${startString}`}</b>
                              </p>
                                )}
                          </div>
                        </div>
                      )
                    })}
                </Row>

                <div className="small-space"></div>
                <Row>
                  <div className="position-sub-header">
                    <p className="resume-header-no-space">EXTRACURRICULARS</p>
                  </div>

                  {ccaEvents
                    .sort((first, second) => {
                      const startDiff = first.start - second.start
                      const endDiff = first.end - second.end
                      return endDiff !== 0 ? -endDiff : -startDiff
                    })
                    .map((event) => {
                      // get correct string for start date
                      const startMonth = event.start
                        .toDate()
                        .toLocaleString('default', { month: 'long' })
                      const startYear = event.start.toDate().getFullYear()
                      const startString = `${startMonth} ${startYear}`

                      // get correct string for end date
                      const endMonth = event.end
                        .toDate()
                        .toLocaleString('default', { month: 'long' })
                      const endYear = event.end.toDate().getFullYear()
                      const checkPresent = event.end.toDate() >= new Date()
                      const endString = checkPresent
                        ? 'Present'
                        : `${endMonth} ${endYear}`

                      // get correct organisation role
                      const eventOrgRole =
                        event.orgRole.length === 0
                          ? 'Role in event is not specified'
                          : event.orgRole
                      // get correct organisation name
                      const eventOrgName =
                        event.orgName.length === 0
                          ? 'Organisation associated with event is not specified'
                          : event.orgName
                      // get correct event description
                      const eventDescString =
                        event.description.length === 0
                          ? 'Event description is not specified'
                          : event.description

                      return (
                        <div className="role-content-div">
                          <div className="role-details-div">
                            <div>
                              <b>{eventOrgRole}</b> <br></br>{' '}
                              <p className="reduce-p-spacing">{eventOrgName}</p>
                              <ul>
                                <li>{eventDescString}</li>
                              </ul>
                            </div>
                            {startString !== endString
                              ? (
                              <p>
                                <b>{`${startString} - ${endString}`}</b>
                              </p>
                                )
                              : (
                              <p>
                                <b>{`${startString}`}</b>
                              </p>
                                )}
                          </div>
                        </div>
                      )
                    })}
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <div className="top-space"></div>
      </Container>

      {/* Toast for saved notification here */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setNotifySaved(false)}
          show={notifySaved}
          delay={3000}
          autohide
          position="top-center"
          bg="success"
        >
          <Toast.Header>
            <GiConfirmed className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Success
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Your changes have been saved
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}

export default ProgressReport
