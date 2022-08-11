import './CSS/monthyear.css'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState, useEffect, useCallback } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import DateTimePicker from 'react-datetime-picker'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import Select from 'react-select'
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
  Dropdown,
  Offcanvas,
  Stack,
  Toast,
  ToastContainer
} from 'react-bootstrap'
import SideBar from './Sidebar'
import { db, auth } from '../firebase'
import { doc, Timestamp, getDoc, updateDoc } from 'firebase/firestore'
import { BiErrorCircle } from 'react-icons/bi'
import { GiConfirmed } from 'react-icons/gi'

function MonthYear () {
  const todayDate = new Date()

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // CALENDAR //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* Initialise calendar */
  const DnDCalendar = withDragAndDrop(Calendar)

  const locales = {
    'en-US': require('date-fns/locale/en-US')
  }

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  })

  // Used to customise the colour of the new event in the calendar
  const eventPropGetter = useCallback(
    (event) => ({
      ...('colour' in event && {
        style: {
          backgroundColor: event.colour
        }
      })
    }),
    []
  )

  const convertDatesInEvent = (arr) => {
    const resArr = []
    arr.forEach((i) => [
      resArr.push({
        category: i.category,
        colour: i.colour,
        title: i.title,
        description: i.description,
        orgName: i.orgName,
        orgRole: i.orgRole,
        start: i.start.toDate(),
        end: i.end.toDate(),
        done: i.done,
        PR: i.PR
      })
    ])
    return resArr
  }

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // FIREBASE //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const userRef = doc(db, 'Users', auth.currentUser.uid)
  const [allEvents, setAllEvents] = useState([])
  const [loaded, setloaded] = useState(false)
  const [changed, setChanged] = useState(false)

  const getAllEvents = async () => {
    const docu = await getDoc(userRef)
    const allData = docu.data()
    const tempAllEvents = []
    allData.events.map((i) => {
      tempAllEvents.push({
        category: i.category,
        colour: i.colour,
        title: i.title,
        description: i.description,
        orgName: i.orgName,
        orgRole: i.orgRole,
        start: i.start,
        end: i.end,
        done: i.done,
        PR: i.PR
      })
    })
    setAllEvents(tempAllEvents)
    setCatList(allData.tags)
    setloaded(true)
  }

  useEffect(() => {
    getAllEvents()
  }, [])

  // Helper Function to update event in Firebase
  const handleUpdateFirebase = async () => {
    if (changed) {
      await updateDoc(userRef, { events: allEvents })
    }
  }

  useEffect(() => {
    handleUpdateFirebase()
  }, [changed])

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

  function findEvent (event) {
    let index = 0
    for (const currEvent of allEvents) {
      const title = currEvent.title === event.title
      const start =
        currEvent.start.toDate().toLocaleDateString() ===
        event.start.toLocaleDateString()
      const end =
        currEvent.end.toDate().toLocaleDateString() ===
        event.end.toLocaleDateString()
      const cat = currEvent.category === event.category
      const colour = currEvent.colour === event.colour
      const orgName = currEvent.orgName === event.orgName
      const orgRole = currEvent.orgRole === event.orgRole
      const desc = currEvent.description === event.description
      const PR = currEvent.PR === event.PR
      const done = currEvent.done === event.done
      if (
        title &&
        start &&
        end &&
        cat &&
        colour &&
        orgName &&
        orgRole &&
        desc &&
        PR &&
        done
      ) {
        return index
      }
      index += 1
    }
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
      setShowOrgName(false)
      setShowOrgRole(false)
      setShowAddToPR(false)
      setAllEvents([...allEvents, tempEvent])
      setShowAddEventSuccess(true)
      setChanged(true)
      setShowAddEvent(false)
      seteventTitle('')
      seteventStartTime('')
      seteventEndTime('')
      setDropdownOption('')
      seteventOrgName('')
      seteventOrgRole('')
      seteventDes('')
      seteventPR(false)
      setValidated(false)
    }
  }

  // Delete event
  function deleteEvent (pEvent) {
    const reqIndex = findEvent(pEvent)
    allEvents.splice(reqIndex, 1)
    setShowDeleteEventSuccess(true)
    setChanged(true)
    setShowEventDetails(false)
  }

  // Move an event
  function onEventDrag ({ event, start, end }) {
    const reqIndex = findEvent(event)
    allEvents.splice(reqIndex, 1)
    setAllEvents([
      ...allEvents,
      {
        category: event.category,
        colour: event.colour,
        title: event.title,
        description: event.description,
        orgName: event.orgName,
        orgRole: event.orgRole,
        start: Timestamp.fromDate(start),
        end: Timestamp.fromDate(end),
        done: event.done,
        PR: event.PR
      }
    ])
    setChanged(true)
  }

  // Update an event
  function updateEvent (event) {
    setCanvasValidated(true)
    if (displayTitle.length === 0) {
      event.preventDefault()
      return false
    } else {
      const reqIndex = findEvent(event)
      allEvents.splice(reqIndex, 1)
      setAllEvents([
        ...allEvents,
        {
          category: event.category,
          colour: event.colour,
          title: displayTitle,
          description: displayDes,
          orgName: displayOrgName,
          orgRole: displayOrgRole,
          start: Timestamp.fromDate(event.start),
          end: Timestamp.fromDate(event.end),
          done: displayDone,
          PR: displayPR
        }
      ])
      setShowUpdateEventSuccess(true)
      setChanged(true)
    }
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
    } else if (initialColour.length === 0) {
      event.preventDefault()
      setShowBlankTagColour(true)
      return false
    } else {
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
  // HOOKS TO TRACK ELEMENTS TO RENDER //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Creating state to track the event tag, and (optionally) org name, org role,org desc.
  // used to log down event details when an event is clicked
  const [displayTitle, setdisplayTitle] = useState('')
  const [displayCat, setdisplayCat] = useState('')
  const [displayOrgName, setdisplayOrgName] = useState('')
  const [displayOrgRole, setdisplayOrgRole] = useState('')
  const [displayDes, setdisplayDes] = useState('')
  const [displayDone, setdisplayDone] = useState(false)
  const [displayPR, setdisplayPR] = useState(false)

  // Used to check whether the PR option is applicable for update event/task offcanvas component
  // Add to PR option only works when the event/task is under the work/academic/cca categories
  const [checkPRCategory, setCheckPRCategory] = useState(false)
  // Edit orgName and orgRole only works when the event/task is under the work/cca categories
  const [checkNameRoleCategory, setCheckNameRoleCategory] = useState(false)

  // Hooks to trigger pop up when the add event button is clicked
  const [showAddEvent, setShowAddEvent] = useState(false)
  const handleAddEventClose = () => {
    setValidated(false)
    setShowOrgName(false)
    setShowOrgRole(false)
    setShowAddToPR(false)
    setShowAddEvent(false)
    seteventTitle('')
    seteventStartTime('')
    seteventEndTime('')
    setDropdownOption('')
    seteventOrgName('')
    seteventOrgRole('')
    seteventDes('')
    seteventPR(false)
  }

  // Hooks to trigger add tag modal
  const [showAddTag, setShowAddTag] = useState(false)
  const handleTagClose = () => {
    setValidatedTag(false)
    setInitialTitle('')
    setInitialColour('')
    setShowAddTag(false)
  }

  // Hook to keep track of event tag that has been selected in the dropdown
  const [dropdownOption, setDropdownOption] = useState('')

  // Hooks to trigger pop up when the event is selected
  const [showEventDetails, setShowEventDetails] = useState(false)
  const handleEventDetailsClose = () => {
    setShowEventDetails(false)
    setCanvasValidated(false)
  }

  // Hooks to trigger pop up when the delete category is selected
  const [deletePopup, showDeletePopup] = useState(false)
  const handleDeleteClose = () => showDeletePopup(false)

  // Hooks to track the event object selected from the calendar, which will be used for deletion button in the offcanvas widget
  const [eventSelected, setEventSelected] = useState([])

  // Variable to track change in title
  const [initialTitle, setInitialTitle] = useState('')

  // Variable to track colour
  const [initialColour, setInitialColour] = useState('')

  // Hooks to enable add Progress Report option for the Work, Academics and Extracurriculars categories
  const [showAddToPR, setShowAddToPR] = useState(false)

  // Hook to validate event title
  const [validated, setValidated] = useState(false)

  // Hook to validate event title in OffCanvas
  const [canvasValidated, setCanvasValidated] = useState(false)

  // Hook to validate tag title
  const [validatedTag, setValidatedTag] = useState(false)

  // Hooks to trigger extra input fields when the work and cca option in the dropdown is selected (event section)
  const [showOrgName, setShowOrgName] = useState(false)
  const [showOrgRole, setShowOrgRole] = useState(false)

  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TOAST //
  /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // TRIGGER FOR ERROR TOASTS HERE (ADD EVENT)
  const [showBlankDateError, setShowBlankDateError] = useState(false)
  const [showBlankTagError, setShowBlankTagError] = useState(false)
  const [showWrongDateError, setShowWrongDateError] = useState(false)

  // TRIGGER FOR ERROR TOASTS HERE (ADD TAG)
  const [showBlankTagColour, setShowBlankTagColour] = useState(false)

  // TRIGGER FOR SUCCESS TOASTS HERE (ADD EVENT)
  const [showAddEventSuccess, setShowAddEventSuccess] = useState(false)

  // TRIGGER FOR SUCCESS TOASTS HERE (DELETE EVENT)
  const [showDeleteEventSuccess, setShowDeleteEventSuccess] = useState(false)

  // TRIGGER FOR SUCCESS TOASTS HERE (ADD TAG)
  const [showAddTagSuccess, setShowAddTagSuccess] = useState(false)

  // TRIGGER FOR SUCCESS TOASTS HERE (UPDATE EVENT)
  const [updateEventSuccess, setShowUpdateEventSuccess] = useState(false)

  return (
    <>
      <SideBar></SideBar>

      <div className="eventInput_">
        <Button
          variant="outline-primary"
          className="add-event-main-button"
          onClick={() => setShowAddEvent(true)}
        >
          Add Event
        </Button>

        <Dropdown className="pad-dropdown">
          <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
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

      <DnDCalendar
        localizer={localizer}
        events={convertDatesInEvent(allEvents)}
        startAccessor="start"
        endAccessor="end"
        // onSelectEvent is for single click
        onSelectEvent={(e) => {
          if ('title' in e && e.title.length > 0) {
            setdisplayTitle(e.title)
          } else {
            setdisplayTitle('Not Stated')
          }
          if ('category' in e && e.category.length > 0) {
            setdisplayCat(e.category)
          } else {
            setdisplayCat('Not Stated')
          }
          if ('orgName' in e && e.orgName.length > 0) {
            setdisplayOrgName(e.orgName)
          } else {
            setdisplayOrgName('Not Stated')
          }
          if ('orgRole' in e && e.orgRole.length > 0) {
            setdisplayOrgRole(e.orgRole)
          } else {
            setdisplayOrgRole('Not Stated')
          }
          if ('description' in e && e.description.length > 0) {
            setdisplayDes(e.description)
          } else {
            setdisplayDes('Not Stated')
          }
          setCheckPRCategory(
            e.category === 'Work' ||
              e.category === 'Academics' ||
              e.category === 'Extracurriculars'
          )
          setCheckNameRoleCategory(
            e.category === 'Work' || e.category === 'Extracurriculars'
          )
          setdisplayDone(e.done)
          setdisplayPR(e.PR)
          setEventSelected(e)
          setShowEventDetails(true)
        }}
        onEventDrop={onEventDrag}
        onEventResize={onEventDrag}
        eventPropGetter={eventPropGetter}
        selectable
        resizable
        style={{ height: 500, margin: '50px' }}
      />

      {/* =============================================================================== */}
      {/* Modal for adding event */}
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
      {/* Modal for tag system */}
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
                required
                type="text"
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

          <Form.Group as={Col}>
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
          </Form.Group>
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
      {/* Modal for displaying event information */}
      {/* =============================================================================== */}

      <Offcanvas
        show={showEventDetails}
        onHide={handleEventDetailsClose}
        placement="end"
        scroll={true}
        backdrop={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="wrap-offcanvas-title">
            <Container>
              <Row>
                <Col xs={9}>{displayTitle}</Col>
                <Col xs={3}>
                  <Button
                    className="canvas-delete-button"
                    onClick={() => {
                      deleteEvent(eventSelected)
                    }}
                    variant="danger"
                  >
                    {' '}
                    Delete Event
                  </Button>
                </Col>
              </Row>
            </Container>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container>
            <Stack gap={3}>
              <Form
                noValidate
                validated={canvasValidated}
                onSubmit={() => updateEvent(eventSelected)}
              >
                <Form.Group as={Col}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    defaultValue={displayTitle}
                    onChange={(event) => setdisplayTitle(event.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid event title
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>

              <Form.Group as={Col}>
                <Form.Label>Event Tag</Form.Label>
                <Form.Select disabled>
                  <option>{displayCat}</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={displayDes}
                  onChange={(event) => setdisplayDes(event.target.value)}
                />
              </Form.Group>

              {checkNameRoleCategory
                ? (
                <Form.Group as={Col}>
                  <Form.Label>Organisation Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={displayOrgName}
                    onChange={(event) => setdisplayOrgName(event.target.value)}
                  />
                </Form.Group>
                  )
                : (
                <Form.Group as={Col}>
                  <Form.Label>Organisation Name</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    defaultValue={displayOrgName}
                    onChange={(event) => setdisplayOrgName(event.target.value)}
                  />
                </Form.Group>
                  )}

              {checkNameRoleCategory
                ? (
                <Form.Group as={Col}>
                  <Form.Label>Role in Organisation</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={displayOrgRole}
                    onChange={(event) => setdisplayOrgRole(event.target.value)}
                  />
                </Form.Group>
                  )
                : (
                <Form.Group as={Col}>
                  <Form.Label>Role in Organisation</Form.Label>
                  <Form.Control
                    disabled
                    type="text"
                    defaultValue={displayOrgRole}
                    onChange={(event) => setdisplayOrgRole(event.target.value)}
                  />
                </Form.Group>
                  )}

              <Form.Check
                label="Done"
                checked={displayDone}
                onChange={() => setdisplayDone(!displayDone)}
              ></Form.Check>

              {checkPRCategory
                ? (
                <Form.Check
                  type="switch"
                  label="Add to Progress Report"
                  checked={displayPR}
                  onChange={() => setdisplayPR(!displayPR)}
                ></Form.Check>
                  )
                : (
                <Form.Check
                  type="switch"
                  disabled
                  label="Add to Progress Report"
                  checked={displayPR}
                ></Form.Check>
                  )}

              <Button
                onClick={() => {
                  updateEvent(eventSelected)
                }}
                variant="outline-primary"
              >
                {' '}
                Save Changes{' '}
              </Button>
            </Stack>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>

      {/* =============================================================================== */}
      {/* All toasts for event success/warning messages here */}
      {/* =============================================================================== */}

      {/* All toasts for success/warning messages here */}

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

      {/* When the event is successfully deleted */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowDeleteEventSuccess(false)}
          show={showDeleteEventSuccess}
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
            Your event has been deleted
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

      {/* When the event details have been successfully updated */}
      <ToastContainer className="show-toast" position="top-center">
        <Toast
          onClose={() => setShowUpdateEventSuccess(false)}
          show={updateEventSuccess}
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
            Your event details have been updated
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}

export default MonthYear
