import "./CSS/monthyear.css"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect, useCallback } from "react"
import "react-datepicker/dist/react-datepicker.css"
import DateTimePicker from 'react-datetime-picker'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Select from 'react-select'
import { Button, Modal, Form, Row, Col, Container, Dropdown, Offcanvas } from "react-bootstrap"
import SideBar from "./Sidebar";
import { db, auth } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, getDoc, updateDoc } from "firebase/firestore";
import { set } from "date-fns";

function MonthYear() {

    /* Initialise calendar */
    const DnDCalendar = withDragAndDrop(Calendar)

    const locales = {
        "en-US": require("date-fns/locale/en-US"),
    }

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales
    })

    /* Creating state to input events */
    const [allEvents, setAllEvents] = useState([])
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", colour: "", done: false })

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
                    <Col md="auto"><p className="tag-label-space">
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
                        <Col md="auto"><p className="tag-label-space">
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


    //Function to remove element from checkedItems when it is unselected 
    function removeItem(input) {
        checkedItems = checkedItems.filter(item => item !== input)
    }

    //Used to customise the colour of the new event in the calendar 
    const eventPropGetter = useCallback(
        (event) => (

            {
                ...("colour" in event && {
                    style: {
                        backgroundColor: event.colour,
                    }
                })
            }
        ), [])

    //Firebase implementation

    //Get all user's events from firebase
    const userRef = doc(db, "Users", auth.currentUser.uid);
    const [changed, setChanged] = useState(false);

    const getAllEvents = async () => {
        const docu = await getDoc(userRef);
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
        setCatList(docu.data().tags);
    }

    useEffect(() => {
        getAllEvents();
    }, [])

    //Add an event
    const handleAddEvent = async () => {
        newEvent.description = des;
        setAllEvents([...allEvents, newEvent])
        window.confirm("Event has been added")
        setChanged(true)
    }

    //Delete event
    function deleteEvent(pEvent) {
        const r = window.confirm("Would you like to remove this event?")
        if (r === true) {
            const reqIndex = allEvents.indexOf(pEvent)
            allEvents.splice(reqIndex, 1)
            setChanged(true)
        }
    }

    //Move an event
    function onEventDrag({ event, start, end }) {
        const reqIndex = allEvents.indexOf(event)
        allEvents.splice(reqIndex, 1)
        setAllEvents([...allEvents,
        {
            title: event.title,
            start: start,
            end: end,
            colour: event.colour,
            description: event.description,
            orgDesc: event.orgDesc,
            orgName: event.orgName,
            orgRole: event.orgRole,
            category: event.category,
            done: false,
        }
        ])
        setChanged(true)
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

    return (
        <>
            <SideBar></SideBar>

            <div className="eventInput_">
                <Button variant="outline-primary" className="add-event-main-button" onClick={
                    () => setShowAddEvent(true)
                }>Add Event</Button>

                <Dropdown className="pad-dropdown">
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

            <DnDCalendar
                localizer={localizer}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                //onSelectEvent is for single click
                onSelectEvent={e => {
                    if ("title" in e && e.title.length > 0) {
                        setEventTitle(e.title)
                    } else {
                        setEventTitle("Not Stated")
                    }
                    if ("category" in e && e.category.length > 0) {
                        setTagDetails(e.category)
                    } else {
                        setTagDetails("No")
                    }
                    if ("orgName" in e && e.orgName.length > 0) {
                        setEventName(e.orgName)
                    } else {
                        setEventName("Not Stated")
                    }
                    if ("orgRole" in e && e.orgRole.length > 0) {
                        setEventRole(e.orgRole)
                    } else {
                        setEventRole("Not Stated")
                    }
                    if ("orgDesc" in e && e.orgDesc.length > 0) {
                        setEventDesc(e.orgDesc)
                    } else {
                        setEventDesc("Not Stated")
                    }
                    setEventDescription(e.description)
                    setEventSelected(e)
                    setShowEventDetails(true)
                }}
                onEventDrop={onEventDrag}
                onEventResize={onEventDrag}
                eventPropGetter={eventPropGetter}
                selectable
                resizable
                style={{ height: 500, margin: "50px" }} />

            {/* Styles down below are for triggering all pop-ups */}
            <Modal show={showAddEvent} onHide={handleAddEventClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Event</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <div className="pad-bottom">
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
                                                className="inline-display"
                                                value={newEvent.start}
                                                onChange={(start) => setNewEvent({ ...newEvent, start })
                                                } />
                                        </Col>

                                        <Col>
                                            <Form.Label>End Date and Time</Form.Label>
                                            <DateTimePicker
                                                className="inline-display"

                                                value={newEvent.end}
                                                onChange={(end) => setNewEvent({ ...newEvent, end })
                                                } />
                                        </Col>
                                    </Row>
                                </Container>


                                <div className="pad-top-and-bottom">
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

                                <Form.Group className="mb-3">
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
                    <Button variant="outline-primary" onClick={handleAddEvent}>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Organisation Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the organisation name here"
                                onBlur={e => {
                                    setInitialOrgName(e.target.value)
                                }} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Role In Workplace</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description of role here"
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

            <Offcanvas show={showEventDetails} onHide={handleEventDetailsClose} placement="bottom" scroll={true} backdrop={true}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{eventTitle}
                        <Button className="canvas-delete-button" onClick={() => {
                            deleteEvent(eventSelected)
                        }} variant="danger"> Delete Event</Button>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <table>
                        <tr>
                            <td>
                                <b>Description:</b>
                            </td>
                            <td>
                                {eventDescription}
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <b>Category: </b>
                            </td>
                            <td>
                                {tagDetails}
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <b>Organisation Name: </b>
                            </td>
                            <td>
                                {eventName}
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <b>Role in Organisation: </b>
                            </td>
                            <td>
                                {eventRole}
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <b>Description of Tasks:&emsp; </b>
                            </td>
                            <td>
                                {eventDesc}
                            </td>
                        </tr>
                    </table>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default MonthYear