import React, { useState, useEffect } from 'react'
import SideBar from './Sidebar'
import { doc, Timestamp, updateDoc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import './CSS/today.css'
import DateTimePicker from 'react-datetime-picker'
import TimePicker from 'react-time-picker'
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Card,
  Accordion,
  Stack,
  Toast,
  ToastContainer
} from 'react-bootstrap'
import { AiOutlineSmile } from 'react-icons/ai'
import { TbMoon } from 'react-icons/tb'
import Select from 'react-select'
import { BiErrorCircle } from 'react-icons/bi'
import { GiConfirmed } from 'react-icons/gi'

function Today () {
  const todayDate = new Date()
  const yr = todayDate.getFullYear()
  const mth = todayDate.getMonth()
  const date = todayDate.getDate()

  const isTdyDate = (d) => {
    return (
      d.toDate().getFullYear() === yr &&
      d.toDate().getMonth() === mth &&
      d.toDate().getDate() === date
    )
  }

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // FIREBASE //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const userRef = doc(db, 'Users', auth.currentUser.uid)
  const [loaded, setLoaded] = useState(false)

  const getAllData = async () => {
    const docu = await getDoc(userRef)
    const AllData = docu.data()
    setCatList(AllData.tags)
    setAllEvents(AllData.events)
    AllData.stress.map((dat) => {
      if (isTdyDate(dat.date)) {
        setShowStressButtons(false)
      }
    })
    AllData.sleep.map((dat) => {
      if (isTdyDate(dat.date)) {
        setShowSleepButtons(false)
      }
    })
    setAllStressData(AllData.stress)
    setAllSleepData(AllData.sleep)
    setLoaded(true)
  }

  useEffect(() => {
    getAllData()
  }, [])

  // Function to check if event occurs today and only today
  const isTdy = (event) => {
    return (
      todayDate.getFullYear() === event.start.toDate().getFullYear() &&
      todayDate.getMonth() === event.start.toDate().getMonth() &&
      todayDate.getDate() === event.start.toDate().getDate() &&
      todayDate.getFullYear() === event.end.toDate().getFullYear() &&
      todayDate.getMonth() === event.end.toDate().getMonth() &&
      todayDate.getDate() === event.end.toDate().getDate()
    )
  }

  // Function to check if event(spans multiple days) happens today
  const happensTdy = (event) => {
    if (
      event.start.toDate().getFullYear() === event.end.toDate().getFullYear() &&
      event.start.toDate().getMonth() === event.end.toDate().getMonth() &&
      event.start.toDate().getDate() === event.end.toDate().getDate()
    ) {
      return false
    }
    if (
      (yr === event.start.toDate().getFullYear() &&
        mth === event.start.toDate().getMonth() &&
        date === event.start.toDate().getDate()) ||
      (yr === event.end.toDate().getFullYear() &&
        mth === event.end.toDate().getMonth() &&
        date === event.end.toDate().getDate())
    ) {
      return true
    }
    if (
      event.start.toDate().getTime() <= todayDate.getTime() &&
      todayDate.getTime() <= event.end.toDate().getTime()
    ) {
      return true
    } else {
      return false
    }
  }

  // Splits allEvents into tdyEvents and happenTdyEvents
  const [allEvents, setAllEvents] = useState([])
  const [tdyEvents, setTdyEvents] = useState([])
  const [happenTdyEvents, setHappenTdyEvents] = useState([])

  useEffect(() => {
    setTdyEvents([])
    setHappenTdyEvents([])
    allEvents.map((i) => {
      if (isTdy(i)) {
        setTdyEvents((tdyEvents) => [...tdyEvents, i])
      }
      if (happensTdy(i)) {
        setHappenTdyEvents((happenTdyEvents) => [...happenTdyEvents, i])
      }
    })
  }, [allEvents])

  // Helper Function to update event in Firebase
  const [changed, setChanged] = useState(false)
  const handleUpdateFirebase = async () => {
    if (changed) {
      await updateDoc(userRef, { events: allEvents })
      setChanged(false)
    }
  }

  useEffect(() => {
    handleUpdateFirebase()
  }, [changed])

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // HOOKS TO TRACK ELEMENTS TO RENDER //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Hooks to enable add Progress Report option for the Work, Academics and Extracurriculars categories (Events)
  const [showAddToPR, setShowAddToPR] = useState(false)

  // Hooks to enable add Progress Report option for the Work, Academics and Extracurriculars categories (Tasks)
  const [showAddTaskToPR, setShowAddTaskToPR] = useState(false)

  // Hooks to trigger pop up when the add event button is clicked
  const [showAddTask, setShowAddTask] = useState(false)
  const handleAddTaskClose = () => {
    setShowTodayOrgName(false)
    setShowTodayOrgRole(false)
    setShowAddTaskToPR(false)
    setShowAddTask(false)
    settaskTitle('')
    settaskStartTime('')
    settaskEndTime('')
    setTaskOption('')
    settaskOrgName('')
    settaskOrgRole('')
    settaskDes('')
    settaskPR(false)
    setValidatedTask(false)
  }

  // Hooks to trigger pop up when the add event button is clicked
  const [showAddEvent, setShowAddEvent] = useState(false)
  const handleAddEventClose = () => {
    setShowOrgName(false)
    setShowOrgRole(false)
    setShowAddToPR(false)
    setShowAddEvent(false)
    setDropdownOption('')
    seteventTitle('')
    seteventStartTime('')
    seteventEndTime('')
    seteventOrgName('')
    seteventOrgRole('')
    seteventDes('')
    seteventPR(false)
    setValidated(false)
  }

  // Hooks to trigger add tag modal
  const [showAddTag, setShowAddTag] = useState(false)
  const handleTagClose = () => {
    setValidatedTag(false)
    setInitialTitle('')
    setInitialColour('')
    setShowAddTag(false)
  }

  // Hooks to trigger pop up when the delete category is selected
  const [deletePopup, showDeletePopup] = useState(false)
  const handleDeleteClose = () => showDeletePopup(false)

  // Variable to track change in title
  const [initialTitle, setInitialTitle] = useState('')

  // Variable to track colour
  const [initialColour, setInitialColour] = useState('')

  // Hook to validate event title
  const [validated, setValidated] = useState(false)

  // Hook to validate tag title
  const [validatedTag, setValidatedTag] = useState(false)

  // Hook to validate task title
  const [validatedTask, setValidatedTask] = useState(false)

  // Hook to keep track of event tag that has been selected in the dropdown (for events section)
  const [dropdownOption, setDropdownOption] = useState('')

  // Hook to keep track of event tag that has been selected in the dropdown (for tasks section)
  const [taskOption, setTaskOption] = useState('')

  // Hooks to trigger extra input fields when the work and cca option in the dropdown is selected (event section)
  const [showOrgName, setShowOrgName] = useState(false)
  const [showOrgRole, setShowOrgRole] = useState(false)

  // Hooks to trigger extra input fields when the work and cca option in the dropdown is selected (checklist section)
  const [showTodayOrgName, setShowTodayOrgName] = useState(false)
  const [showTodayOrgRole, setShowTodayOrgRole] = useState(false)

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TASKS //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [taskTitle, settaskTitle] = useState('')
  const [taskStartTime, settaskStartTime] = useState('')
  const [taskEndTime, settaskEndTime] = useState('')
  const [taskCat, settaskCat] = useState('')
  const [taskColour, settaskColour] = useState('')
  const [taskOrgName, settaskOrgName] = useState('')
  const [taskOrgRole, settaskOrgRole] = useState('')
  const [taskDes, settaskDes] = useState('')
  const [taskPR, settaskPR] = useState(false)

  const handleTaskTagChange = (e) => {
    settaskCat(e.value)
    settaskColour(e.colour)
  }

  // Adds task to Firebase
  const addTask = async (event) => {
    setValidatedTask(true)
    if (taskTitle.length === 0) {
      event.preventDefault()
      return false
    } else if (taskStartTime === '' || taskEndTime === '') {
      setShowBlankTimeError(true)
      event.preventDefault()
      return false
    } else if (taskStartTime >= taskEndTime) {
      setShowWrongTimeError(true)
      event.preventDefault()
      return false
    } else if (taskOption.length === 0) {
      setShowBlankTaskTag(true)
      event.preventDefault()
      return false
    } else {
      const tempTask = {
        title: taskTitle,
        start: Timestamp.fromDate(
          new Date(
            yr,
            mth,
            date,
            taskStartTime.split(':')[0],
            taskStartTime.split(':')[1]
          )
        ),
        end: Timestamp.fromDate(
          new Date(
            yr,
            mth,
            date,
            taskEndTime.split(':')[0],
            taskEndTime.split(':')[1]
          )
        ),
        category: taskCat,
        colour: taskColour,
        orgName: taskOrgName,
        orgRole: taskOrgRole,
        description: taskDes,
        PR: taskPR,
        done: false
      }
      setShowTodayOrgName(false)
      setShowTodayOrgRole(false)
      setShowAddTaskToPR(false)
      setAllEvents([...allEvents, tempTask])
      setShowAddTaskSuccess(true)
      setChanged(true)
      setShowAddTask(false)
      settaskTitle('')
      settaskStartTime('')
      settaskEndTime('')
      setTaskOption('')
      settaskOrgName('')
      settaskOrgRole('')
      settaskDes('')
      settaskPR(false)
      setValidatedTask(false)
    }
  }

  // Task is done
  const delTask = async (pEvent) => {
    const reqIndex = allEvents.indexOf(pEvent)
    allEvents.splice(reqIndex, 1)
    pEvent.done = true
    setAllEvents((allEvents) => [...allEvents, pEvent])
    setChanged(true)
  }

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EVENTS //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [eventTitle, seteventTitle] = useState('')
  const [eventStartTime, seteventStartTime] = useState('')
  const [eventEndTime, seteventEndTime] = useState('')
  const [eventCat, seteventCat] = useState('')
  const [eventColour, seteventColour] = useState('')
  const [eventOrgName, seteventOrgName] = useState('')
  const [eventOrgRole, seteventOrgRole] = useState('')
  const [eventDes, seteventDes] = useState('')
  const [eventPR, seteventPR] = useState(false)

  const handleEventTagChange = (e) => {
    seteventCat(e.value)
    seteventColour(e.colour)
  }

  // Adds event to Firebase
  const addEvent = async (event) => {
    setValidated(true)
    if (eventTitle.length === 0) {
      event.preventDefault()
      return false
    } else if (eventStartTime === '' || eventEndTime === '') {
      setShowBlankDateError(true)
      event.preventDefault()
      return false
    } else if (eventStartTime >= eventEndTime) {
      setShowWrongDateError(true)
      event.preventDefault()
      return false
    } else if (dropdownOption.length === 0) {
      setShowBlankTagError(true)
      event.preventDefault()
      return false
    } else {
      const tempEvent = {
        title: eventTitle,
        start: Timestamp.fromDate(eventStartTime),
        end: Timestamp.fromDate(eventEndTime),
        category: eventCat,
        colour: eventColour,
        orgName: eventOrgName,
        orgRole: eventOrgRole,
        description: eventDes,
        PR: eventPR,
        done: false
      }
      setDropdownOption('')
      setAllEvents([...allEvents, tempEvent])
      setShowAddEventSuccess(true)
      setChanged(true)
      setShowOrgName(false)
      setShowOrgRole(false)
      setShowAddToPR(false)
      setShowAddEvent(false)
      seteventTitle('')
      seteventStartTime('')
      seteventEndTime('')
      seteventOrgName('')
      seteventOrgRole('')
      seteventDes('')
      seteventPR(false)
      setValidated(false)
    }
  }

  // Event is done
  const delEvent = async (pEvent) => {
    const reqIndex = allEvents.indexOf(pEvent)
    allEvents.splice(reqIndex, 1)
    pEvent.done = true
    setAllEvents((allEvents) => [...allEvents, pEvent])
    setChanged(true)
  }

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TAGS //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [catList, setCatList] = useState([])

  const [newList, setNewList] = useState(
    catList.map((x) => ({
      id: x.id,
      value: x.value,
      colour: x.colour,
      label: (
        <Container>
          <Row>
            <Col md="auto">
              {' '}
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: x.colour,
                  borderRadius: '50%',
                  marginTop: '5px'
                }}
              >
                {' '}
              </div>{' '}
            </Col>
            <Col md="auto">
              <p
                style={{
                  marginLeft: '5px',
                  marginTop: '2.5px'
                }}
              >
                {x.value}
              </p>{' '}
            </Col>
          </Row>
        </Container>
      )
    }))
  )

  const catGenerator = () => {
    setNewList(
      catList.map((x) => ({
        id: x.id,
        value: x.value,
        colour: x.colour,
        label: (
          <Container>
            <Row>
              <Col md="auto">
                {' '}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: x.colour,
                    borderRadius: '50%',
                    marginTop: '5px'
                  }}
                >
                  {' '}
                </div>{' '}
              </Col>
              <Col md="auto">
                <p
                  style={{
                    marginLeft: '5px',
                    marginTop: '2.5px'
                  }}
                >
                  {x.value}
                </p>{' '}
              </Col>
            </Row>
          </Container>
        )
      }))
    )
  }

  useEffect(() => {
    catGenerator()
  }, [catList])

  const handleAddTag = async (event) => {
    setValidatedTag(true)
    if (initialTitle.length === 0) {
      event.preventDefault()
      return false
    }
    if (initialColour.length === 0) {
      event.preventDefault()
      setShowBlankTagColour(true)
      return false
    } else {
      setValidatedTag(false)
      setCatList([
        ...catList,
        {
          value: initialTitle,
          colour: initialColour,
          id: catList.length + 1 + ':' + initialTitle + initialColour
        }
      ])
      setShowAddTagSuccess(true)
      setInitialTitle('')
      setInitialColour('')
    }
  }

  const addTag = async () => {
    if (catList.length !== 0) {
      await updateDoc(userRef, { tags: catList })
    }
  }

  const remTag = (i) => {
    setCatList(catList.filter((tag) => tag.id !== i.id))
  }

  useEffect(() => {
    addTag()
  }, [catList])

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // STRESS //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [showMoodModal, setShowMoodModal] = useState(false)
  const [showStressButtons, setShowStressButtons] = useState(true)
  const [stressLvl, setstressLvl] = useState(0)
  const [stressActivities, setstressActivities] = useState([])
  const [allStressData, setAllStressData] = useState([])
  const [changedTwo, setChangedTwo] = useState(false)

  const handleStressLvl = (v) => {
    setstressLvl(v)
  }

  const handleStressActivities = (v) => {
    const tempStressActivities = []
    let toRemove = false
    stressActivities.forEach((i) => {
      if (i !== v) {
        tempStressActivities.push(i)
      } else {
        toRemove = true
      }
    })
    if (!toRemove) {
      tempStressActivities.push(v)
    }
    setstressActivities(tempStressActivities)
  }

  const handleStressClick = async (event) => {
    if (stressLvl === 0) {
      event.preventDefault()
      setSelectStress(true)
      return false
    }
    if (stressActivities.length === 0) {
      event.preventDefault()
      setSelectStressActivity(true)
      return false
    } else {
      setAllStressData((allStressData) => [
        ...allStressData,
        { level: parseInt(stressLvl), date: new Date(), tag: stressActivities }
      ])
      setChangedTwo(true)
      setShowStressLogged(true)
      setShowMoodModal(false)
    }
  }

  useEffect(() => {
    if (changedTwo) {
      updateDoc(userRef, { stress: allStressData })
      setChangedTwo(false)
      setstressActivities([])
      setShowStressButtons(false)
    }
  }, [allStressData])

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // SLEEP //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [showSleepModal, setShowSleepModal] = useState(false)
  const [showSleepButtons, setShowSleepButtons] = useState(true)
  const [noOfHoursSlept, setNoOfHoursSlept] = useState(100)
  const [slpQuality, setslpQuality] = useState(0)
  const [allSleepData, setAllSleepData] = useState([])
  const [changedThree, setChangedThree] = useState(false)

  const slpHours = []
  for (let i = 0; i <= 24; i = i + 0.5) {
    slpHours.push({ value: i.toFixed(1), label: i.toFixed(1) })
  }

  const handleSlpHours = (v) => {
    setNoOfHoursSlept(v)
  }

  const handleSlpQuality = (v) => {
    setslpQuality(v)
  }

  const handleSleepSubmit = async (event) => {
    if (slpQuality === 0) {
      event.preventDefault()
      setSelectQuality(true)
      return false
    }
    if (noOfHoursSlept === 100) {
      event.preventDefault()
      setSelectHours(true)
      return false
    } else {
      setAllSleepData((allSleepData) => [
        ...allSleepData,
        {
          hours: parseFloat(noOfHoursSlept),
          quality: parseInt(slpQuality),
          date: new Date()
        }
      ])
      setShowSleepLogged(true)
      setShowSleepModal(false)
      setChangedThree(true)
    }
  }

  useEffect(() => {
    if (changedThree) {
      updateDoc(userRef, { sleep: allSleepData })
      setChangedThree(false)
      setShowSleepButtons(false)
    }
  }, [allSleepData])

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TOAST //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* All event toasts below */
  // TRIGGER FOR ERROR TOASTS HERE (ADD EVENT)
  const [showBlankDateError, setShowBlankDateError] = useState(false)
  const [showBlankTagError, setShowBlankTagError] = useState(false)
  const [showWrongDateError, setShowWrongDateError] = useState(false)

  // TRIGGER FOR ERROR TOASTS HERE (ADD TAG)
  const [showBlankTagColour, setShowBlankTagColour] = useState(false)

  // TRIGGER FOR SUCCESS TOASTS HERE (ADD EVENT)
  const [showAddEventSuccess, setShowAddEventSuccess] = useState(false)

  // TRIGGER FOR SUCCESS TOASTS HERE (ADD TAG)
  const [showAddTagSuccess, setShowAddTagSuccess] = useState(false)

  /* All tasks toasts below */
  // Triggers for error toasts here

  // ERROR TOASTS
  // Happens when there is no start/end time
  const [showBlankTimeError, setShowBlankTimeError] = useState(false)
  // Happens when start time >= end time
  const [showWrongTimeError, setShowWrongTimeError] = useState(false)
  // Happens when there is no event tag selected
  const [showBlankTaskTag, setShowBlankTaskTag] = useState(false)

  // SUCCESS TOASTS
  // Happens when a task has been added
  const [showAddTaskSuccess, setShowAddTaskSuccess] = useState(false)

  /* All stress and sleep tracking toasts below */
  // Stress tracking toast hooks here
  const [showStressLogged, setShowStressLogged] = useState(false)
  // trigger for error toast (stress level not selected)
  const [selectStress, setSelectStress] = useState(false)
  // trigger for error toast (stress activity not selected)
  const [selectStressActivity, setSelectStressActivity] = useState(false)

  // Sleep tracking toast hooks here
  const [showSleepLogged, setShowSleepLogged] = useState(false)
  // trigger for error toast (sleep quality not selected)
  const [selectQuality, setSelectQuality] = useState(false)
  const [selectHours, setSelectHours] = useState(false)

  return (
    <>
      <SideBar></SideBar>

      {/* =============================================================================== */}
      {/* Stress and Sleep buttons */}
      {/* =============================================================================== */}

      <Container>
        <div className="top-spacing">
          <div>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Click here to log your stress level</Tooltip>}
            >
              <Button variant="warning" onClick={() => setShowMoodModal(true)}>
                <AiOutlineSmile fontSize="1.7em" />
              </Button>
            </OverlayTrigger>
          </div>

          <div className="button-left-space">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Click here to log your sleep quality</Tooltip>}
            >
              <Button variant="info" onClick={() => setShowSleepModal(true)}>
                <TbMoon fontSize="1.7em" />
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </Container>

      {/* =============================================================================== */}
      {/* Today's Tasks and Events scheduled for Today */}
      {/* =============================================================================== */}

      <Container>
        <Row>
          <Col xs={5}>
            <Card>
              <Card.Body>
                <div className="flex-display">
                  <Button
                    onClick={() => setShowAddTask(true)}
                    variant="outline-primary"
                    className="push-right"
                  >
                    +
                  </Button>
                </div>
                <div>
                  <h3 className="center-heading">Today's Tasks</h3>
                </div>
                <em>Add items reserved for today here as a quick checklist</em>
                <hr></hr>
                <Form>
                  {tdyEvents
                    .sort((a, b) => a.start - b.start)
                    .map((i) => {
                      return (
                        <>
                          {!i.done && (
                            <Form.Check
                              label={`${i.title} from ${i.start
                                .toDate()
                                .toLocaleTimeString()} to ${i.end
                                .toDate()
                                .toLocaleTimeString()}`}
                              onClick={() => delTask(i)}
                            ></Form.Check>
                          )}
                        </>
                      )
                    })}
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={7}>
            <Card>
              <Card.Body>
                <div className="push-multiple-right">
                  <div className="right-space">
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowAddEvent(true)}
                      className="inputChild_"
                    >
                      Add Event
                    </Button>
                  </div>
                  <div>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-success"
                        id="dropdown-basic"
                      >
                        Edit Tags
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setShowAddTag(true)}>
                          Create New Tag
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => showDeletePopup(true)}>
                          Delete Existing Tag
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                <h3>Events Scheduled for Today</h3>
                <em>
                  Calendar events that are scheduled for today will appear here
                </em>
                <hr></hr>

                <Accordion>
                  {happenTdyEvents
                    .sort((a, b) => a.start - b.start)
                    .map((i) => {
                      return (
                        <>
                          {!i.done && (
                            <Accordion.Item eventKey={i}>
                              <div>
                                <Accordion.Header>{i.title}</Accordion.Header>

                                <Accordion.Body>
                                  <div className="push-multiple-right">
                                    <Button
                                      variant="outline-danger"
                                      onClick={() => delEvent(i)}
                                    >
                                      Event Done
                                    </Button>
                                  </div>
                                  <p>
                                    <b> Start Date and Time: </b>{' '}
                                    {`${i.start
                                      .toDate()
                                      .toLocaleDateString()}, ${i.start
                                      .toDate()
                                      .toLocaleTimeString()}`}
                                  </p>

                                  <p>
                                    <b>End Date and Time: </b>{' '}
                                    {`${i.end
                                      .toDate()
                                      .toLocaleDateString()}, ${i.end
                                      .toDate()
                                      .toLocaleTimeString()}`}{' '}
                                  </p>

                                  <p>
                                    <b>Category: </b> {i.category}
                                  </p>

                                  <p>
                                    <b>Description: </b>
                                    {i.description.length === 0
                                      ? 'Not Stated'
                                      : i.description}
                                  </p>
                                </Accordion.Body>
                              </div>
                            </Accordion.Item>
                          )}
                        </>
                      )
                    })}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* =============================================================================== */}
      {/* =============================================================================== */}
      {/* All modals listed down below */}
      {/* =============================================================================== */}
      {/* =============================================================================== */}

      {/* =============================================================================== */}
      {/* Modal for logging stress level here */}
      {/* =============================================================================== */}

      <Modal
        backdrop="static"
        show={showMoodModal}
        onHide={() => {
          setstressLvl(0)
          setstressActivities([])
          setShowMoodModal(false)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Stress Level</Modal.Title>
        </Modal.Header>

        {showStressButtons
          ? (
          <Modal.Body>
            <h5 className="text-center">
              Select your stress level for the day
            </h5>
            <div className="modal-border">
              <Stack direction="horizontal" gap={5}>
                <Stack>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rb"
                      id={1}
                      onChange={(event) => handleStressLvl(event.target.id)}
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#128555;</p>
                        <span className="emoji-label">Very Stressed</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rb"
                      id={3}
                      onChange={(event) => handleStressLvl(event.target.id)}
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#128528;</p>
                        <span className="emoji-label">Neutral</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rb"
                      id={5}
                      onChange={(event) => handleStressLvl(event.target.id)}
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#128522;</p>
                        <span className="emoji-label">Very Relaxed</span>
                      </div>
                    </label>
                  </div>
                </Stack>

                <Stack>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rb"
                      id={2}
                      onChange={(event) => handleStressLvl(event.target.id)}
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#128531;</p>
                        <span className="emoji-label">Stressed</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rb"
                      id={4}
                      onChange={(event) => handleStressLvl(event.target.id)}
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#128524;</p>
                        <span className="emoji-label">Relaxed</span>
                      </div>
                    </label>
                  </div>
                </Stack>
              </Stack>
            </div>

            <h5 className="text-center">
              Select the activities related to your stress level
            </h5>

            <div className="modal-border">
              <Stack direction="horizontal" gap={5}>
                <Stack>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="Studying"
                      onChange={(event) =>
                        handleStressActivities(event.target.id)
                      }
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#x1f4da;</p>
                        <span className="emoji-label">Studying</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="Work + Intern"
                      onChange={(event) =>
                        handleStressActivities(event.target.id)
                      }
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#x1f454;</p>
                        <span className="emoji-label">Work + Intern</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="CCA"
                      onChange={(event) =>
                        handleStressActivities(event.target.id)
                      }
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#x1f50e;</p>
                        <span className="emoji-label">CCA</span>
                      </div>
                    </label>
                  </div>
                </Stack>

                <Stack>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="Exercising"
                      onChange={(event) =>
                        handleStressActivities(event.target.id)
                      }
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#x1f3c3;</p>
                        <span className="emoji-label">Exercising</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="Socialising"
                      onChange={(event) =>
                        handleStressActivities(event.target.id)
                      }
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#x1f389;</p>
                        <span className="emoji-label">Socialising</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="Leisure"
                      onChange={(event) =>
                        handleStressActivities(event.target.id)
                      }
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#x1f343;</p>
                        <span className="emoji-label">Leisure</span>
                      </div>
                    </label>
                  </div>
                </Stack>
              </Stack>
            </div>
          </Modal.Body>
            )
          : (
          <Modal.Body>
            <div> Your stress level has been logged for the day</div>
          </Modal.Body>
            )}

        {showStressButtons
          ? (
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setstressLvl(0)
                setstressActivities([])
                setShowMoodModal(false)
              }}
            >
              Close
            </Button>
            <Button variant="outline-success" onClick={handleStressClick}>
              Submit Data
            </Button>
          </Modal.Footer>
            )
          : (
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setShowMoodModal(false)
              }}
            >
              Close
            </Button>
          </Modal.Footer>
            )}
      </Modal>

      {/* =============================================================================== */}
      {/* Modal for logging sleep quality here */}
      {/* =============================================================================== */}

      <Modal
        backdrop="static"
        show={showSleepModal}
        onHide={() => {
          setslpQuality(0)
          setNoOfHoursSlept(100)
          setShowSleepModal(false)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sleep Quality</Modal.Title>
        </Modal.Header>

        {showSleepButtons
          ? (
          <Modal.Body>
            <h5 className="text-center">Rate your sleep quality</h5>
            <div className="modal-border">
              <Stack direction="horizontal" gap={5}>
                <Stack>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="nw"
                      id={1}
                      onChange={(event) => handleSlpQuality(event.target.id)}
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size"> &#128078;</p>
                        <span className="emoji-label">Poor</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="nw"
                      id={3}
                      onChange={(event) => handleSlpQuality(event.target.id)}
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#128077;</p>
                        <span className="emoji-label">Good</span>
                      </div>
                    </label>
                  </div>
                </Stack>

                <Stack>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="nw"
                      id={2}
                      onChange={(event) => handleSlpQuality(event.target.id)}
                    ></input>
                    <label className="form-check-label">
                      <div className="flex-display">
                        <p className="emoji-size">&#128076;</p>
                        <span className="emoji-label">Okay</span>
                      </div>
                    </label>
                  </div>
                </Stack>
              </Stack>
            </div>

            <h5 className="text-center">Select your sleep duration</h5>
            <div className="modal-border">
              <Select
                defaultValue={{ label: 'Select hours', value: 0 }}
                options={slpHours}
                onChange={(event) => handleSlpHours(event.value)}
              />
            </div>
          </Modal.Body>
            )
          : (
          <Modal.Body>
            <div>Your sleep quality has been logged for the day</div>
          </Modal.Body>
            )}

        {showSleepButtons
          ? (
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setslpQuality(0)
                setNoOfHoursSlept(100)
                setShowSleepModal(false)
              }}
            >
              Close
            </Button>
            <Button variant="outline-success" onClick={handleSleepSubmit}>
              Submit Data
            </Button>
          </Modal.Footer>
            )
          : (
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowSleepModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
            )}
      </Modal>

      {/* =============================================================================== */}
      {/* Modal that pops up to add events */}
      {/* =============================================================================== */}

      <Modal backdrop="static" show={showAddEvent} onHide={handleAddEventClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <div className="bottom-space-small">
                  <Form noValidate validated={validated} onSubmit={addEvent}>
                    <Form.Group as={Col}>
                      <Form.Label>Event Title</Form.Label>
                      <Form.Control
                        required
                        placeholder="Add Title"
                        onChange={(event) => seteventTitle(event.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please add an event title
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form>
                </div>

                <Container>
                  <Stack direction="horizontal" gap={5}>
                    <div>
                      <Form.Label>Start Date and Time</Form.Label>

                      <DateTimePicker
                        value={eventStartTime}
                        onChange={(event) => seteventStartTime(event)}
                      />
                    </div>

                    <div>
                      <Form.Label>End Date and Time</Form.Label>
                      <DateTimePicker
                        value={eventEndTime}
                        onChange={(event) => seteventEndTime(event)}
                      />
                    </div>
                  </Stack>
                </Container>

                <div className="top-bottom-space">
                  <Form.Label>Event Tag</Form.Label>
                  <Select
                    options={newList}
                    placeholder="Choose a tag"
                    onChange={(e) => {
                      setDropdownOption(e.id)
                      switch (e.id) {
                        case '1:Work#d7a9e3ff':
                          handleEventTagChange(e)
                          setShowOrgName(true)
                          setShowOrgRole(true)
                          setShowAddToPR(true)
                          break
                        case '2:Extracurriculars#8bbee8ff':
                          handleEventTagChange(e)
                          setShowOrgName(true)
                          setShowOrgRole(true)
                          setShowAddToPR(true)
                          break
                        case '3:Academics#a8d5baff':
                          handleEventTagChange(e)
                          setShowOrgName(false)
                          setShowOrgRole(false)
                          setShowAddToPR(true)
                          break
                        default:
                          handleEventTagChange(e)
                          setShowOrgName(false)
                          setShowOrgRole(false)
                          setShowAddToPR(false)
                          break
                      }
                    }}
                  />
                </div>

                <div className="inline-style">
                  <div className="adjust-form-width">
                    {showOrgName && (
                      <Form.Group className="mb-3">
                        <Form.Label>Organisation Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Organisation Name"
                          onBlur={(e) => {
                            seteventOrgName(e.target.value)
                          }}
                        />
                      </Form.Group>
                    )}
                  </div>

                  <div className="adjust-form-width">
                    {showOrgRole && (
                      <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Organisation Role"
                          onBlur={(e) => {
                            seteventOrgRole(e.target.value)
                          }}
                        />
                      </Form.Group>
                    )}
                  </div>
                </div>

                <div>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter event description here"
                      onBlur={(e) => {
                        seteventDes(e.target.value)
                      }}
                    />
                  </Form.Group>

                  {showAddToPR && (
                    <div className="add-pr-switch">
                      <Form>
                        <Form.Check
                          type="switch"
                          onClick={() => seteventPR(!eventPR)}
                          label="Add to Progress Report"
                        />
                      </Form>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleAddEventClose}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={addEvent}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =============================================================================== */}
      {/* Modal that pops up to add task for today only */}
      {/* =============================================================================== */}

      <Modal backdrop="static" show={showAddTask} onHide={handleAddTaskClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <div className="bottom-space-small">
                  <Form noValidate validated={validatedTask} onSubmit={addTask}>
                    <Form.Group as={Col}>
                      <Form.Label>Task Title</Form.Label>
                      <Form.Control
                        required
                        placeholder="Add Title"
                        onChange={(event) => settaskTitle(event.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please add a valid task title
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form>
                </div>

                <Container>
                  <Row>
                    <div className = "inline-style">
                      <div>
                        <div>
                          <Form.Label>Start Time</Form.Label>
                        </div>

                        <div>
                          <TimePicker
                            disableClock={true}
                            value={taskStartTime}
                            onChange={(event) => settaskStartTime(event)}
                          />
                        </div>
                      </div>

                      <div>
                        <div>
                          <Form.Label>End Time</Form.Label>
                        </div>

                        <div>
                          <TimePicker
                            disableClock={true}
                            value={taskEndTime}
                            onChange={(event) => settaskEndTime(event)}
                          />
                        </div>
                      </div>
                    </div>
                  </Row>
                </Container>

                <div className="top-bottom-space">
                  <Form.Label>Task Tag</Form.Label>
                  <Select
                    options={newList}
                    placeholder="Choose a tag"
                    onChange={(e) => {
                      setTaskOption(e.id)
                      switch (e.id) {
                        case '1:Work#d7a9e3ff':
                          handleTaskTagChange(e)
                          setShowTodayOrgName(true)
                          setShowTodayOrgRole(true)
                          setShowAddTaskToPR(true)
                          break
                        case '2:Extracurriculars#8bbee8ff':
                          handleTaskTagChange(e)
                          setShowTodayOrgName(true)
                          setShowTodayOrgRole(true)
                          setShowAddTaskToPR(true)
                          break
                        case '3:Academics#a8d5baff':
                          handleTaskTagChange(e)
                          setShowTodayOrgName(false)
                          setShowTodayOrgRole(false)
                          setShowAddTaskToPR(true)
                          break
                        default:
                          handleTaskTagChange(e)
                          setShowTodayOrgName(false)
                          setShowTodayOrgRole(false)
                          setShowAddTaskToPR(false)
                          break
                      }
                    }}
                  />
                </div>

                <div className="inline-style">
                  <div className="adjust-form-width">
                    {showTodayOrgName && (
                      <Form.Group className="mb-3">
                        <Form.Label>Organisation Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Organisation Name"
                          onBlur={(e) => {
                            settaskOrgName(e.target.value)
                          }}
                        />
                      </Form.Group>
                    )}
                  </div>

                  <div className="adjust-form-width">
                    {showTodayOrgRole && (
                      <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Organisation Role"
                          onBlur={(e) => {
                            settaskOrgRole(e.target.value)
                          }}
                        />
                      </Form.Group>
                    )}
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    onBlur={(e) => {
                      settaskDes(e.target.value)
                    }}
                  />
                </Form.Group>

                {showAddTaskToPR && (
                  <div className="add-pr-switch">
                    <Form>
                      <Form.Check
                        type="switch"
                        onClick={() => settaskPR(!taskPR)}
                        label="Add to Progress Report"
                      />
                    </Form>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleAddTaskClose}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={addTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =============================================================================== */}
      {/* Modal that pops up for tag system */}
      {/* =============================================================================== */}

      <Modal backdrop="static" show={showAddTag} onHide={handleTagClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validatedTag} onSubmit={handleAddTag}>
            <Form.Group as={Col}>
              <Form.Label>Tag Name</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter the name of the new tag here"
                onChange={(e) => {
                  setInitialTitle(e.target.value)
                }}
              />
              <Form.Control.Feedback type="invalid">
                Please add a tag name
              </Form.Control.Feedback>
            </Form.Group>
          </Form>

          <Form.Label htmlFor="exampleColorInput">
            Choose Tag Colour{' '}
          </Form.Label>
          <Form.Control
            type="color"
            id="exampleColorInput"
            defaultValue="#FF0000"
            onChange={(e) => {
              setInitialColour(e.target.value)
            }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleTagClose}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={handleAddTag}>
            Create Tag
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal backdrop="static" show={deletePopup} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Tags</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {newList.map((entry) => {
              if (entry.id.split(':')[0] > 4) {
                return (
                  <div className="flex-display">
                    <label>{entry.label} &nbsp; </label>
                    <div className="push-right">
                      <Button
                        variant="outline-danger"
                        id={entry.id}
                        onClick={(e) => {
                          remTag({
                            id: entry.id,
                            value: entry.value,
                            colour: entry.colour
                          })
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              }
            })}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleDeleteClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =============================================================================== */}
      {/* All toasts for event success/warning messages here */}
      {/* =============================================================================== */}

      {/* When no start date and time + end date and time is specified for the event added */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowBlankDateError(false)}
          show={showBlankDateError}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Missing fields for event start date and time + event end date and
            time
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When the start date < end date for event added */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowWrongDateError(false)}
          show={showWrongDateError}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Your event start date and time should occur before your event end
            date and time
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When no tag is being associated with the event added */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowBlankTagError(false)}
          show={showBlankTagError}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select an event tag
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When the event has been successfully added */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowAddEventSuccess(false)}
          show={showAddEventSuccess}
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
            Your event has been added
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When no tag colour has been specified for a new tag */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowBlankTagColour(false)}
          show={showBlankTagColour}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select a colour for your tag
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When the tag is successfully added */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowAddTagSuccess(false)}
          show={showAddTagSuccess}
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
            Your event tag has been created
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* All toasts for tasks success/warning messages here */}

      {/* When no start or end time has been specified for a task */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowBlankTimeError(false)}
          show={showBlankTimeError}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select a start and end time for your task
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When the task start time >= the task end time */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowWrongTimeError(false)}
          show={showWrongTimeError}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            The start time of your task should occur before the end time of your
            task
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When no event tag is specified for the task */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowBlankTaskTag(false)}
          show={showBlankTaskTag}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select an event tag for your task
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When the event is successfully added */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowAddTaskSuccess(false)}
          show={showAddTaskSuccess}
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
            Your task has been created
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* All toasts for sleep and stress tracking system here */}

      {/* When sleep has been logged */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowSleepLogged(false)}
          show={showSleepLogged}
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
            Your sleep quality has been recorded
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When sleep quality has not been indicated */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setSelectQuality(false)}
          show={selectQuality}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select your sleep quality
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When sleep duration has not been indicated */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setSelectHours(false)}
          show={selectHours}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select your sleep duration
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When stress level has not been indicated */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setSelectStress(false)}
          show={selectStress}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select your stress level for the day
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When activity assoc. with stress level has not been indicated */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setSelectStressActivity(false)}
          show={selectStressActivity}
          delay={3000}
          autohide
          position="top-center"
          bg="danger"
        >
          <Toast.Header>
            <BiErrorCircle className="me-2" size={20} />
            <strong className="me-auto" style={{ fontSize: '18px' }}>
              Error
            </strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Please select the activities associated with your stress level
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* When stress level has been logged */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowStressLogged(false)}
          show={showStressLogged}
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
            Your stress level has been recorded
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}

export default Today
