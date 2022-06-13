import "./CSS/forms.css"
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

    const events = [
        {
            title: "Big Meeting",
            allDay: true,
            start: new Date(2022, 4, 0),
            end: new Date(2022, 4, 0)
        },

        {
            title: "Vacation",
            start: new Date(2022, 4, 7),
            end: new Date(2022, 4, 10)
        },

        {
            title: "Conference",
            start: new Date(2022, 4, 20),
            end: new Date(2022, 4, 23)
        },
    ]

    /* Creating state to input events */
    const [allEvents, setAllEvents] = useState(events)
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", colour: "" })

    //Creating state to track the event tag, and (optionally) org name, org role,org desc. used to log down event details when an event is clicked
    const [tagDetails, setTagDetails] = useState("")
    const [eventTitle, setEventTitle] = useState("")
    const [eventName, setEventName] = useState("")
    const [eventRole, setEventRole] = useState("")
    const [eventDesc, setEventDesc] = useState("")

    /* Functions to handle adding, resizing and deleting events in the calendar */
    function handleAddEvent() {
        setAllEvents([...allEvents, newEvent])
        window.confirm("Event had been added")
    }

    function onEventDrag({ event, start, end }) {
        const idx = allEvents.indexOf(event)
        const updatedEvent = { ...event, start, end }
        allEvents.splice(idx, 1, updatedEvent)
        return allEvents
    }

    function onSelectEvent(pEvent) {
        const r = window.confirm("Would you like to remove this event?")
        if (r === true) {
            const reqIndex = allEvents.indexOf(pEvent)
            allEvents.splice(reqIndex, 1)
            return { allEvents }
        }
    }

    /* Code to manage the colour and tags of events in the calendar. This is the DEFAULT but NOT FINAL list of options */
    const [catList, setCatList] = useState([
        {
            id: 1,
            value: "Work",
            colour: "#d7a9e3ff",
        }, {
            id: 2,
            value: "Extracurriculars",
            colour: "#8bbee8ff",
        }, {
            id: 3,
            value: "Academics",
            colour: "#a8d5baff",
        }, {
            id: 4,
            value: "Others",
            colour: "#3174ad",
        }
    ]);


    //Used to generate list of all possible tags 
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

    //Setting to adjust the length of tag bar 
    const customStyles = {
        // control represent the select component
        control: (provided) => ({
            ...provided,
            width: '300px',
            height: "25px"
        }),
        container: base => ({
            ...base,
            flex: 1
        })
    }

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
    let checkedItems = []

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

    //Hooks to change title,tag value and list of existing tags (when a new custom tag is created) (useEffect)
    useEffect(() => {
        setNewTag({ ...newTag, id: newList.length + 1, value: initialTitle })
    }, [initialTitle, newList.length])

    useEffect(() => {
        setNewTag({
            ...newTag, colour: initialColour, label: <Container>
                <Row>
                    <Col md="auto"> <div style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: initialColour,
                        borderRadius: "50%",
                        marginTop: "5px"
                    }}> </div> </Col>
                    <Col md="auto"><p style={{
                        marginLeft: "10px",
                        marginRight: "50px"
                    }}>
                        {newTag.value}
                    </p> </Col>
                </Row>
            </Container>
        })
    }, [initialColour, newTag.value])

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
        (event) => ({
            ...("colour" in event && {
                style: {
                    backgroundColor: event.colour,
                }
            })
        }), [])

    return (
        <>
            <h1 className="centerHeading">Calendar</h1>
            <div className="eventInput">
                <Button style={{
                    marginTop: "10px", 
                    marginLeft: "auto", 
                    height: "40px"
                }} onClick={//handleAddEvent
                    () => setShowAddEvent(true)
                } className="inputChild">Add Event</Button>

                <Dropdown style={{ marginTop: "10px", marginLeft: "20px" }}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
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
                    <Row>
                        <h6>Event Title:&nbsp;&nbsp;  <input
                            type="text"
                            placeholder="Add Title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({
                                ...newEvent, title: e.target.value, id: allEvents.length + 1
                            })} /> </h6> <br></br>
                    </Row>
                    <Row>
                        <h6>Start Date and Time:&nbsp;&nbsp; <DateTimePicker
                            //placeholderText="Start Date"
                            value={newEvent.start}
                            onChange={(start) => setNewEvent({ ...newEvent, start })
                            } /> </h6>
                    </Row>
                    <Row>
                        <h6>End Date and Time:&nbsp;&nbsp;
                            <DateTimePicker
                                placeholderText="End Date"
                                value={newEvent.end}
                                onChange={(end) => setNewEvent({ ...newEvent, end })
                                } /> </h6>
                    </Row>
                    <Row>
                        <div style={{ display: "inline-flex" }}>
                            <h6 style={{ marginTop: "10px" }}>Event Tag: &nbsp;&nbsp;</h6> <Select options={newList}
                                styles={customStyles}
                                placeholder="Choose a tag"
                                onChange={(e) => {
                                    let catChosen = newList.filter(x => x.id === e.id).map(y => y.value)
                                    let colChosen = newList.filter(x => x.id === e.id).map(y => y.colour)
                                    switch (e.id) {
                                        case 1:
                                            setNewEvent({ ...newEvent, colour: colChosen, category: catChosen })
                                            showWorkPopup(true)
                                            break
                                        case 2:
                                            setNewEvent({ ...newEvent, colour: colChosen, category: catChosen })
                                            showCcaPopup(true)
                                            break
                                        default:
                                            setNewEvent({ ...newEvent, colour: colChosen, category: catChosen, orgName: "", orgRole: "", orgDesc: "" })
                                            break;
                                    }
                                }}
                            />
                        </div>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddEventClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddEvent}>
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
                    <Button variant="secondary" onClick={handleWorkClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleWorkClose}>
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
                    <Button variant="secondary" onClick={handleCcaClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCcaClose}>
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
                    <Button variant="secondary" onClick={handleCustomClose}>
                        Close
                    </Button>
                    <Button variant="primary"
                        onClick={() => {
                            setNewList([...newList, newTag])
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
                            if (entry.id > 4)
                                return <div className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        id={entry.id}
                                        label={entry.value}
                                        onClick={e => {
                                            if (e.target.checked) {
                                                checkedItems.push(e.target.id)
                                            } else if (e.target.checked === false) {
                                                removeItem(e.target.id)
                                            }
                                        }}
                                    />
                                </div>
                        })}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={
                        () => {
                            newList.filter(value => !checkedItems.includes(value.id.toString()))
                            setNewList(newList.filter(value => !checkedItems.includes(value.id.toString())))
                        }
                    }>
                        Confirm Deletion
                    </Button>
                </Modal.Footer>
            </Modal>

            <Offcanvas show={showEventDetails} onHide={handleEventDetailsClose} placement="bottom" scroll={true} backdrop={true}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{tagDetails} Category
                        <Button style={{ marginLeft: "100px" }} onClick={() => {
                            onSelectEvent(eventSelected)
                        }} variant="danger"> Delete Event</Button>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <b> Event Selected: </b> {eventTitle} <br></br>
                    <b> Organisation Name: </b> {eventName} <br></br>
                    <b>Role in Organisation:</b> {eventRole} <br></br>
                    <b>Description of Tasks: </b> {eventDesc} <br></br>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default MonthYear