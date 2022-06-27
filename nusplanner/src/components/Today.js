import React, { useState, useEffect } from 'react'
import SideBar from "./Sidebar"
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, Timestamp, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./CSS/today.css"
import DateTimePicker from 'react-datetime-picker'
import TimePicker from 'react-time-picker';
import { Button, Modal, Form, Row, Col, Container, Dropdown, Alert, Card, Accordion } from "react-bootstrap"
import Select from 'react-select'

function Today() {

    //Hook to close pop-up for logging sleep and mood data
    const [show, setShow] = useState(true);

    const [loaded, setLoaded] = useState(false);

    const userRef = doc(db, "Users", auth.currentUser.uid);

    /* Creating state to input events */
    const [allEvents, setAllEvents] = useState([])
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", colour: "", description: "", done: false })

    //Creating state to track the event tag, and (optionally) org name, org role,org desc. 
    //used to log down event details when an event is clicked
    const [tagDetails, setTagDetails] = useState("")
    const [eventTitle, setEventTitle] = useState("")
    const [eventName, setEventName] = useState("")
    const [eventRole, setEventRole] = useState("")
    const [eventDesc, setEventDesc] = useState("")
    const [eventDescription, setEventDescription] = useState("")

    /* Code to manage the colour and tags of events in the calendar. This is the DEFAULT but NOT FINAL list of options */
    const [catList, setCatList] = useState([]);

    //Used to generate list of all possible tags from catList
    const [newList, setNewList] = useState(catList.map(x => ({
        id: x.id,
        value: x.value,
        colour: x.colour,
        label:
            <Container>
                <Row>
                    <Col md="auto"> <div style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: x.colour,
                        borderRadius: "50%",
                        marginTop: "5px"
                    }}> </div> </Col>
                    <Col md="auto"><p style={{
                        marginLeft: "5px",
                        marginTop: "2.5px"
                    }}>
                        {x.value}
                    </p> </Col>
                </Row>
            </Container>
    })))

    const catGenerator = () => {
        setNewList(catList.map(x => ({
            id: x.id,
            value: x.value,
            colour: x.colour,
            label:
                <Container>
                    <Row>
                        <Col md="auto"> <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: x.colour,
                            borderRadius: "50%",
                            marginTop: "5px"
                        }}> </div> </Col>
                        <Col md="auto"><p style={{
                            marginLeft: "5px",
                            marginTop: "2.5px"
                        }}>
                            {x.value}
                        </p> </Col>
                    </Row>
                </Container>
        })))
    }

    useEffect(() => {
        catGenerator();
    }, [catList])


    //Hooks to trigger pop up when the add event button is clicked
    const [showAddTask, setShowAddTask] = useState(false)
    const handleAddTaskClose = () => setShowAddTask(false)

    //Hooks to trigger pop up when the add event button is clicked
    const [showAddEvent, setShowAddEvent] = useState(false)
    const handleAddEventClose = () => setShowAddEvent(false)

    //Hooks to trigger pop up when the event is selected 
    const [showEventDetails, setShowEventDetails] = useState(false)
    const handleEventDetailsClose = () => setShowEventDetails(false)

    //Hooks to trigger pop up when the work special category is selected 
    const [workPopup, showWorkPopup] = useState(false)
    const handleWorkClose = () => showWorkPopup(false)

    //Hooks to trigger pop up when the cca special category is selected
    const [ccaPopup, showCcaPopup] = useState(false)
    const handleCcaClose = () => showCcaPopup(false)

    //Hooks to trigger pop up when the custom category is selected 
    const [customPopup, showCustomPopup] = useState(false)
    const handleCustomClose = () => showCustomPopup(false)

    //Hooks to trigger pop up when the delete category is selected
    const [deletePopup, showDeletePopup] = useState(false)
    const handleDeleteClose = () => showDeletePopup(false)

    //Array to add item checked to be deleted
    const [checkedItems, setCheckedItems] = useState([])

    //Hooks to track the event object selected from the calendar, which will be used for deletion button in the offcanvas widget 
    const [eventSelected, setEventSelected] = useState([])

    //Hooks to handle title and colour input of new tag
    const [newTag, setNewTag] = useState([{}])

    //Variable to track change in title
    const [initialTitle, setInitialTitle] = useState("")

    //Variable to track colour 
    const [initialColour, setInitialColour] = useState("")

    //Variable to track category of tag selected 
    const [initialCategory, setInitialCategory] = useState("")

    //Variable to track orgName for work category 
    const [initialOrgName, setInitialOrgName] = useState("")

    //Variable to track orgRole for work category 
    const [initialOrgRole, setInitialOrgRole] = useState("")

    //Variable to track orgDesc for work category 
    const [initialOrgDesc, setInitialOrgDesc] = useState("")

    //Variable to track Description for all categories
    const [des, setDes] = useState("")

    //Hooks to change title,tag value and list of existing tags (when a new custom tag is created) (useEffect)
    const handleAddTag = async () => {
        setCatList([...catList, {
            value: initialTitle,
            colour: initialColour,
            id: ((catList.length) + 1) + ":" + initialTitle + initialColour
        }])
    }

    //Hooks to change the following fields for work and cca categories: orgName, orgRole, orgDesc
    useEffect(() => {
        setNewEvent({ ...newEvent, orgName: initialOrgName })
    }, [initialOrgName])

    useEffect(() => {
        setNewEvent({ ...newEvent, orgRole: initialOrgRole })
    }, [initialOrgRole])

    useEffect(() => {
        setNewEvent({ ...newEvent, orgDesc: initialOrgDesc })
    }, [initialOrgDesc])

    const getAllEvents = async () => {
        const docu = await getDoc(userRef);
        setCatList(docu.data().tags);
        docu.data().stress.map((dat) => {
            if (isTdyDate(dat)) {
                setShowStressButtons(false)
            }
        })
        docu.data().sleep.map((dat) => {
            if (isTdyDate(dat)) {
                setShowSleepButtons(false)
            }
        })
        docu.data().events.map((dat) => {
            setAllEvents(allEvents => [...allEvents,
            {
                title: dat.title,
                start: dat.start.toDate(),
                end: dat.end.toDate(),
                colour: dat.colour,
                description: dat.description,
                orgDesc: dat.orgDesc,
                orgName: dat.orgName,
                orgRole: dat.orgRole,
                category: dat.category,
                done: dat.done,
            }
            ]);
        })
        setAllStressData(docu.data().stress);
        setAllSleepData(docu.data().sleep);
        setLoaded(true);
    }

    useEffect(() => {
        return () => {
            getAllEvents();
        }
    }, [])

    const todayDate = new Date();

    //Function to check if date is today
    const isTdyDate = (dat) => {
        return (dat.date.toDate().toDateString()) === (todayDate.toDateString())
    }

    //Function to check if event occurs today and only today
    const isTdy = (event) => {
        console.log(event)
        return (
            todayDate.getFullYear() === event.start.getFullYear() &&
            todayDate.getMonth() === event.start.getMonth() &&
            todayDate.getDate() === event.start.getDate() &&

            todayDate.getFullYear() === event.end.getFullYear() &&
            todayDate.getMonth() === event.end.getMonth() &&
            todayDate.getDate() === event.end.getDate()
        )
    }

    //Function to check if event(spans multiple days) happens today
    const happensTdy = (event) => {
        if (
            event.start.getFullYear() === event.end.getFullYear() &&
            event.start.getMonth() === event.end.getMonth() &&
            event.start.getDate() === event.end.getDate()
        ) { return false }
        if (
            (todayDate.getFullYear() === event.start.getFullYear() &&
                todayDate.getMonth() === event.start.getMonth() &&
                todayDate.getDate() === event.start.getDate())
            ||
            (todayDate.getFullYear() === event.end.getFullYear() &&
                todayDate.getMonth() === event.end.getMonth() &&
                todayDate.getDate() === event.end.getDate())
        ) { return true }
        if (event.start.getTime() <= todayDate.getTime() && todayDate.getTime() <= event.end.getTime()) { return true }
        else { return false }
    }

    //Splits allEvents into tdyEvents and happenTdyEvents
    const [tdyEvents, setTdyEvents] = useState([]);
    const [happenTdyEvents, setHappenTdyEvents] = useState([]);
    useEffect(() => {
        allEvents.map((i) => {
            if (isTdy(i)) {
                setTdyEvents(tdyEvents => [...tdyEvents, i])
            }
            if (happensTdy(i)) {
                setHappenTdyEvents(happenTdyEvents => [...happenTdyEvents, i])
            }
        })


    }, [allEvents])

    const [changed, setChanged] = useState(false);

    //Adds event to Firebase
    const addEvent = async () => {
        newEvent.description = des;
        setAllEvents([...allEvents, newEvent])
        window.confirm("Event had been added")
        setChanged(true);
    }

    //Adds task to Firebase
    const addTask = async () => {
        newEvent.description = des;
        const newStartTime = new Date();
        newStartTime.setHours(newEvent.start.split(":")[0], newEvent.start.split(":")[1], 0, 0);
        const newEndTime = new Date();
        newEndTime.setHours(newEvent.end.split(":")[0], newEvent.end.split(":")[1], 0, 0);
        newEvent.start = newStartTime
        newEvent.end = newEndTime
        setAllEvents([...allEvents, newEvent])
        window.confirm("Event had been added")
        setChanged(true);
    }

    //Deletes event from Firebase
    const delEvent = async (pEvent) => {
        const r = window.confirm("Would you like to remove this event?")
        if (r === true) {
            const reqIndex = allEvents.indexOf(pEvent);
            allEvents.splice(reqIndex, 1);
            pEvent.done = true;
            setAllEvents(allEvents => [...allEvents, pEvent]);
            setChanged(true)
        }
    }

    //Helper Function to update event in Firebase
    const handleUpdateFirebase = async () => {
        if (changed) {
            await updateDoc(userRef, { events: allEvents });
            window.location.reload(false);
        }
    }

    useEffect(() => {
        handleUpdateFirebase();
    }, [changed])

    // Add tag to Firebase
    const addTag = async () => {
        if (catList.length !== 0) {
            await updateDoc(userRef, { tags: catList });
        }
    }

    // Remove tag from Firebase
    const remTag = (i) => {
        setCatList(catList.filter(tag => tag.id !== i.id))
    }

    useEffect(() => {
        addTag();
    }, [catList])

    let slpHours = [];
    for (let i = 0; i <= 24; i = i + 0.5) {
        slpHours.push({ value: i.toFixed(1), label: i.toFixed(1) });
    }

    //Hooks for stress
    const [showStressButtons, setShowStressButtons] = useState(true);
    const [allStressData, setAllStressData] = useState([]);
    const [changedTwo, setChangedTwo] = useState(false);

    //Funcs for stress
    const handleStressClick = async (v) => {
        setAllStressData(allStressData => [...allStressData, { level: parseInt(v), date: new Date() }]);
        setChangedTwo(true);
        window.confirm("Stress level logged!")

    }

    useEffect(() => {
        if (changedTwo) {
            updateDoc(userRef, { stress: allStressData });
            window.location.reload(false);
        }
    }, [allStressData])

    //Hooks for sleep
    const [showSleepButtons, setShowSleepButtons] = useState(true);
    const [noOfHoursSlept, setNoOfHoursSlept] = useState(0);
    const [activeSlp, setActiveSlp] = useState("");
    const [allSleepData, setAllSleepData] = useState([]);
    const [changedThree, setChangedThree] = useState(false);

    //Funcs for sleep
    const handleSlpHours = (v) => {
        setNoOfHoursSlept(v);
    }

    const handleSleepClick = (event) => {
        setActiveSlp(event.target.id);
    }

    const handleSleepSubmit = async () => {
        setAllSleepData(allSleepData => [...allSleepData, { hours: parseInt(noOfHoursSlept), quality: parseInt(activeSlp), date: new Date() }])
        setChangedThree(true);
        window.confirm("Sleep logged!")
    }

    useEffect(() => {
        if (changedThree) {
            updateDoc(userRef, { sleep: allSleepData });
            window.location.reload(false);
        }
    }, [allSleepData])

    const logInfo = () => {
        console.log(allEvents);
        console.log(newEvent);
        console.log(tdyEvents);
        console.log(happenTdyEvents);
        console.log(des)
    }


    return (
        <>
            <SideBar></SideBar>

            <div className="top-spacing">
                
                <Alert variant="success" className="alert-size" dismissible show={show} onClose={() => setShow(false)}>
                    <Alert.Heading><h3 className="center-and-pad-bottom">Welcome back!</h3></Alert.Heading>
                    <Container>
                        <Row>
                            {/* Section here is for the display for users to log their sleep quality */}
                            {showSleepButtons && loaded &&
                                <Col>
                                    <h5 className="center-content-horizontally">How was the quality of your sleep?</h5>
                                    <div className="center-and-pad-bottom">
                                        <div className="emotions-div">
                                            <Button
                                                key={1}
                                                className={activeSlp === "0" ? "active" : undefined}
                                                id={"0"}
                                                onClick={handleSleepClick}
                                                style={{
                                                    height: "50px",
                                                    width: "50px",
                                                    backgroundColor: "#d1e7dd",
                                                    borderColor: "#d1e7dd",
                                                    margin: "auto",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <div className="emoji-size">
                                                    &#128078;
                                                </div>
                                            </Button>
                                            <h6 className="emoji-label">
                                                Poor
                                            </h6>
                                        </div>


                                        <div className="emotions-div">
                                            <Button
                                                key={2}
                                                className={activeSlp === "0.5" ? "active" : undefined}
                                                id={"0.5"}
                                                onClick={handleSleepClick}
                                                style={{
                                                    height: "50px",
                                                    width: "50px",
                                                    backgroundColor: "#d1e7dd",
                                                    borderColor: "#d1e7dd",
                                                    margin: "auto",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <div className="emoji-size">
                                                    &#128076;
                                                </div>
                                            </Button>
                                            <h6 className="emoji-label">
                                                Okay
                                            </h6>
                                        </div>


                                        <div className="emotions-div">
                                            <Button
                                                key={3}
                                                className={activeSlp === "1" ? "active" : undefined}
                                                id={"1"}
                                                onClick={handleSleepClick}
                                                style={{
                                                    height: "50px",
                                                    width: "50px",
                                                    backgroundColor: "#d1e7dd",
                                                    borderColor: "#d1e7dd",
                                                    margin: "auto",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <div className="emoji-size">
                                                    &#128077;
                                                </div>
                                            </Button>
                                            <h6 className="emoji-label">
                                                Good
                                            </h6>
                                        </div>
                                    </div>

                                    <h5 className="pad-top-and-center">How many hours of sleep did you get?</h5>

                                    <Select
                                        defaultValue={{ label: "Select hours", value: 0 }}
                                        options={slpHours}
                                        onChange={(event) =>
                                            handleSlpHours(event.value)
                                        }
                                    />

                                    <div className="submit-sleep-data">
                                        <Button variant="outline-dark" onClick={() => handleSleepSubmit()}>Submit</Button>
                                    </div>
                                </Col>
                            }

                            {/* Section here is for the display for users to log their emotions */}

                            {showStressButtons && loaded &&
                                <Col>
                                    <h5 className="center-content-horizontally">How are you feeling today?</h5>
                                    <div className="center-content-horizontally">

                                        <div className="emotions-div">
                                            <Button
                                                value={1} onClick={(event) =>
                                                    handleStressClick(event.target.value)
                                                } className="emoji-button">
                                                <div className="emoji-size">
                                                    &#128555;
                                                </div>
                                            </Button>
                                            <h6 className="emoji-label">
                                                Very Stressed
                                            </h6>
                                        </div>

                                        <div className="emotions-div">
                                            <Button
                                                value={0.75} onClick={(event) => handleStressClick(event.target.value)} className="emoji-button">
                                                <div className="emoji-size">
                                                    &#128531;
                                                </div>
                                            </Button>
                                            <h6 className="emoji-label">
                                                Stressed
                                            </h6>
                                        </div>

                                        <div className="emotions-div">
                                            <Button
                                                value={0.5} onClick={(event) => handleStressClick(event.target.value)} className="emoji-button">
                                                <div className="emoji-size">
                                                    &#128528;
                                                </div>
                                            </Button>
                                            <h6 className="emoji-label">
                                                Neutral
                                            </h6>
                                        </div>

                                        <div className="emotions-div">
                                            <Button
                                                value={0.25} onClick={(event) => handleStressClick(event.target.value)}
                                                className="emoji-button"
                                            >
                                                <div className="emoji-size">
                                                    &#128524;
                                                </div>
                                            </Button>
                                            <h6 className="emoji-label">
                                                Relaxed
                                            </h6>
                                        </div>

                                        <div className="emotions-div">
                                            <Button
                                                value={0} onClick={(event) => handleStressClick(event.target.value)}
                                                className="emoji-button"
                                            >
                                                <div className="emoji-size">
                                                    &#128522;
                                                </div>
                                            </Button>

                                            <h6 className="emoji-label">
                                                Very Relaxed
                                            </h6>
                                        </div>

                                    </div>
                                </Col>
                            }
                        </Row>
                    </Container>

                    <hr />
                    <p className="center-content-horizontally">
                        The options in this tab will clear automatically once you log your sleep quality and mood for the day
                    </p>
                </Alert>
            </div>

            <Container>
                <Row>
                    <Col xs={5}>
                        <Card>
                            <Card.Body>
                                <div className="flex-display">
                                    <Button
                                        onClick={
                                            () => setShowAddTask(true)
                                        } variant="outline-primary" className="push-right">+</Button>
                                </div>
                                <div>
                                    <h3 className="center-heading">Today's Tasks</h3>

                                </div>
                                <em>Add items reserved for today here as a quick checklist</em>
                                <hr></hr>
                                <div className="top-space"></div>
                                <Form>
                                    {
                                        tdyEvents.sort((a, b) => a.start - b.start).map((i) => {
                                            return (
                                                <>
                                                    {!i.done &&
                                                        <Form.Check
                                                            label={`${i.title} from ${new Date(i.start).toLocaleTimeString()} to ${new Date(i.end).toLocaleTimeString()}`}
                                                            onClick={() => delEvent(i)}
                                                        >
                                                        </Form.Check>
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </Form>
                            </Card.Body>
                        </Card>

                    </Col>

                    <Col xs={7}>
                        <Card>
                            <Card.Body>
                                <div className="push-multiple-right" >
                                    <div className="right-space">
                                        <Button
                                            variant="outline-primary" onClick={
                                                () => setShowAddEvent(true)
                                            } className="inputChild_">Add Event</Button>
                                    </div>
                                    <div>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
                                                Edit Tags
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    onClick={
                                                        () => showCustomPopup(true)
                                                    }>Create New Tag</Dropdown.Item>

                                                <Dropdown.Item
                                                    onClick={
                                                        () => showDeletePopup(true)
                                                    }>Delete Existing Tag</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>

                                <h3>Events Scheduled for Today</h3>
                                <em>Calendar events that are scheduled for today will appear here
                                </em>
                                <hr></hr>


                                <Accordion>
                                    {
                                        happenTdyEvents.sort((a, b) => a.start - b.start).map((i) => {
                                            return (
                                                <>
                                                    <Accordion.Item>
                                                        {!i.done &&
                                                            <div>
                                                                <Accordion.Header>
                                                                    {i.title}
                                                                </Accordion.Header>

                                                                <Accordion.Body>
                                                                    <div className="push-multiple-right">
                                                                        <Button variant="outline-danger" onClick={() => delEvent(i)}>Event done</Button>
                                                                    </div>
                                                                    <p><b> Start Date and Time: </b> {`${new Date(i.start).toLocaleDateString()}, ${new Date(i.start).toLocaleTimeString()}`}</p>

                                                                    <p><b>End Date and Time: </b> {`${new Date(i.end).toLocaleDateString()}, ${new Date(i.end).toLocaleTimeString()}`} </p>

                                                                    <p><b>Category: </b> {i.category}</p>

                                                                    <p><b>Description: </b>{i.description}</p>
                                                                </Accordion.Body>
                                                            </div>
                                                        }
                                                    </Accordion.Item>
                                                </>
                                            )
                                        })
                                    }
                                </Accordion>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>


            {/* All modals listed down below */}

            <Modal show={showAddEvent} onHide={handleAddEventClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Event</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <div className="bottom-space-small">
                                    <Form.Label>Event Title</Form.Label>
                                    <Form.Control
                                        placeholder="Add Title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({
                                            ...newEvent, title: e.target.value, id: allEvents.length + 1
                                        })}
                                    />
                                </div>

                                <Container>
                                    <Row>
                                        <Col>
                                            <Form.Label>Start Date and Time</Form.Label>

                                            <DateTimePicker
                                                className="inline-style"
                                                value={newEvent.start}
                                                onChange={(start) => setNewEvent({ ...newEvent, start })
                                                } />
                                        </Col>  

                                        <Col>
                                            <Form.Label>End Date and Time</Form.Label>
                                            <DateTimePicker
                                                className="inline-style"

                                                value={newEvent.end}
                                                onChange={(end) => setNewEvent({ ...newEvent, end })
                                                } />
                                        </Col>
                                    </Row>
                                </Container>

                                <div className="top-bottom-space">
                                    <Form.Label>Event Tag</Form.Label>
                                    <Select options={newList}
                                        placeholder="Choose a tag"
                                        onChange={(e) => {
                                            let catChosen = newList.filter(x => x.id === e.id).map(y => y.value)
                                            let colChosen = newList.filter(x => x.id === e.id).map(y => y.colour)
                                            switch (e.id) {
                                                case "1:Work#d7a9e3ff":
                                                    setNewEvent({ ...newEvent, colour: colChosen[0], category: catChosen[0], description: des, })
                                                    showWorkPopup(true)
                                                    break
                                                case "2:Extracurriculars#8bbee8ff":
                                                    setNewEvent({ ...newEvent, colour: colChosen[0], category: catChosen[0], description: des, })
                                                    showCcaPopup(true)
                                                    break
                                                default:
                                                    setNewEvent({ ...newEvent, colour: colChosen[0], category: catChosen[0], description: des, orgName: "", orgRole: "", orgDesc: "" })
                                                    break;
                                            }
                                        }}
                                    />
                                </div>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Description:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter description"
                                        onBlur={e => {
                                            setDes(e.target.value)
                                        }}
                                    />
                                </Form.Group>
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

            <Modal show={workPopup} onHide={handleWorkClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Details for Work Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Organisation Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the organisation name here"
                                onBlur={e => {
                                    setInitialOrgName(e.target.value)
                                }} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Role In Workplace</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description of role here"
                                onBlur={e => {
                                    setInitialOrgRole(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Duties Undertaken</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description of work duties"
                                onBlur={e => {
                                    setInitialOrgDesc(e.target.value)
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleWorkClose}>
                        Close
                    </Button>
                    <Button variant="outline-success" onClick={handleWorkClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={ccaPopup} onHide={handleCcaClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Details for Extracurriculars Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name of Extracurricular Activity </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the name of the extracurricular here"
                                onBlur={e => {
                                    setInitialOrgName(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Role In Extracurricular Activity </Form.Label>
                            <Form.Control type="text" placeholder="Enter description of role here"
                                onBlur={e => {
                                    setInitialOrgRole(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Duties Undertaken</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description of tasks completed"
                                onBlur={e => {
                                    setInitialOrgDesc(e.target.value)
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCcaClose}>
                        Close
                    </Button>
                    <Button variant="outline-success" onClick={handleCcaClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ............................................................................................ */}
            {/* ............................................................................................ */}
            {/* ............................................................................................ */}

            <Modal show={customPopup} onHide={handleCustomClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Tag Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter the name of the new tag here"
                            onChange={e => {
                                setInitialTitle(e.target.value)
                            }}
                        />
                    </Form.Group>
                    <Form.Label htmlFor="exampleColorInput">Choose Tag Colour </Form.Label>
                    <Form.Control
                        type="color"
                        id="exampleColorInput"
                        defaultValue="#FF0000"
                        onChange={e => {
                            setInitialColour(e.target.value)
                        }}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCustomClose}>
                        Close
                    </Button>
                    <Button variant="outline-primary"
                        onClick={() => {
                            handleAddTag()
                            window.confirm("Tag has been successfully created!")
                        }}>
                        Create Tag
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={deletePopup} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Tags</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {newList.map((entry) => {
                            if (entry.id.split(":")[0] > 4)
                                return <div className="flex-display">
                                    <label>{entry.label} &nbsp; </label>
                                    <div className="push-right">
                                        <Button
                                            variant="outline-danger"
                                            id={entry.id}
                                            onClick={e => {
                                                remTag({ id: entry.id, value: entry.value, colour: entry.colour });
                                            }}
                                        >Delete</Button>
                                    </div>
                                </div>
                        })}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleDeleteClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal that pops up to add task for today only */}

            <Modal show={showAddTask} onHide={handleAddTaskClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <div className="bottom-space-small">
                                    <Form.Label>Task Title</Form.Label>
                                    <Form.Control
                                        placeholder="Add Title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({
                                            ...newEvent, title: e.target.value, id: allEvents.length + 1
                                        })}
                                    />
                                </div>

                                <Container>
                                    <Row>
                                        <Col>
                                            <Form.Label>Start Time</Form.Label>

                                            <TimePicker
                                                value={newEvent.start}
                                                onChange={(start) => setNewEvent({ ...newEvent, start })
                                                } />
                                        </Col>

                                        <Col>
                                            <Form.Label>End Time</Form.Label>
                                            <TimePicker
                                                placeholderText="End Date"
                                                value={newEvent.end}
                                                onChange={(end) => setNewEvent({ ...newEvent, end })
                                                } />
                                        </Col>
                                    </Row>
                                </Container>

                                <div className="top-bottom-space">
                                    <Form.Label>Event Tag</Form.Label>
                                    <Select options={newList}
                                        placeholder="Choose a tag"
                                        onChange={(e) => {
                                            let catChosen = newList.filter(x => x.id === e.id).map(y => y.value)
                                            let colChosen = newList.filter(x => x.id === e.id).map(y => y.colour)
                                            switch (e.id) {
                                                case "1:Work#d7a9e3ff":
                                                    setNewEvent({ ...newEvent, colour: colChosen[0], category: catChosen[0], description: des, })
                                                    showWorkPopup(true)
                                                    break
                                                case "2:Extracurriculars#8bbee8ff":
                                                    setNewEvent({ ...newEvent, colour: colChosen[0], category: catChosen[0], description: des, })
                                                    showCcaPopup(true)
                                                    break
                                                default:
                                                    setNewEvent({ ...newEvent, colour: colChosen[0], category: catChosen[0], description: des, orgName: "", orgRole: "", orgDesc: "" })
                                                    break;
                                            }
                                        }}
                                    />
                                </div>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Description:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter description"
                                        onBlur={e => {
                                            setDes(e.target.value)
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleAddTaskClose}>
                        Close
                    </Button>
                    <Button variant="outline-primary" onClick={addTask}>
                        Add Event
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={workPopup} onHide={handleWorkClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Details for Work Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Organisation Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the organisation name here"
                                onBlur={e => {
                                    setInitialOrgName(e.target.value)
                                }} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Role In Workplace</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description of role here"
                                onBlur={e => {
                                    setInitialOrgRole(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Duties Undertaken</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description of work duties"
                                onBlur={e => {
                                    setInitialOrgDesc(e.target.value)
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleWorkClose}>
                        Close
                    </Button>
                    <Button variant="outline-success" onClick={handleWorkClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={ccaPopup} onHide={handleCcaClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Details for Extracurriculars Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name of Extracurricular Activity </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the name of the extracurricular here"
                                onBlur={e => {
                                    setInitialOrgName(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Role In Extracurricular Activity </Form.Label>
                            <Form.Control type="text" placeholder="Enter description of role here"
                                onBlur={e => {
                                    setInitialOrgRole(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Duties Undertaken</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description of tasks completed"
                                onBlur={e => {
                                    setInitialOrgDesc(e.target.value)
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCcaClose}>
                        Close
                    </Button>
                    <Button variant="outline-success" onClick={handleCcaClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Today

