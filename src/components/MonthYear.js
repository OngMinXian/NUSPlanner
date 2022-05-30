//npm install --save react-big-calendar --legacy-peer-deps
//npm i react-datepicker
//npm i date-fns

import SideBar from "./Sidebar"
import "./CSS/forms.css"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect } from "react"
import "react-datepicker/dist/react-datepicker.css"
import DateTimePicker from 'react-datetime-picker'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db, auth } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, setDoc } from "firebase/firestore";

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

  const [Loaded, setLoaded] = useState(false);

  const col = collection(db, "Event");

  /* Creating state to input events */
  const [allEvents, setAllEvents] = useState([])
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", id: "" })

  /* Functions to handle events */
  function handleAddEvent() {
    addEventToDoc();
    setAllEvents([...allEvents, newEvent]);
  }

  const addEventToDoc = async (e) => {
    await setDoc(doc(col, auth.currentUser.uid+newEvent.title+newEvent.start+newEvent.end), {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        id: auth.currentUser.uid,       
    });
  };

  function onEventDrag({ event, start, end }) {
    const idx = allEvents.indexOf(event)
    const updatedEvent = {...event, start, end}
    allEvents.splice(idx,1,updatedEvent)
    return allEvents
  }

  const onSelectEvent = async (pEvent) => {
    const r = window.confirm("Would you like to remove this event?")
    if (r === true) {
      const DocId = auth.currentUser.uid+pEvent.title+pEvent.start.toString()+pEvent.end.toString();
      console.log(DocId);
      const eventDoc = doc(db, "Event", DocId);
      await deleteDoc(eventDoc);
      window.location.reload(false);
    }
  }

  const getAllEvents = async (e) => {
    const eventsRef = query(col, where("id", "==", auth.currentUser.uid))
    const data = await getDocs(eventsRef);
    data.docs.map((doc) => (
      allEvents.push({
        title: doc.data().title,
        start: doc.data().start.toDate(),
        end: doc.data().end.toDate(),
      })
    ));
    setLoaded(true);
  }

  useEffect (() => {
    return () => {
      getAllEvents();
    }
  }, [])

  return (

    <>
      <SideBar></SideBar>
      {Loaded && <div>
      <h1 className="centerHeading">Calendar</h1>
      <h3 className="centerHeading"><u>Add New Event</u></h3>
      <div className="eventInput">
        <input
          type="text"
          placeholder="Add Title"
          style={{ width: "20%", marginRight: "10px", marginTop: "10px", height: "20%" }}
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="inputChild" />

        <DateTimePicker
          //placeholderText="Start Date"
          value={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })
          }
          className="inputChild" />

        <DateTimePicker
          placeholderText="End Date"
          value={newEvent.end}
          onChange={(end) => setNewEvent({ ...newEvent, end })
          }
          className="inputChild" />

        <button style={{ marginTop: "10px" }} onClick={handleAddEvent} className="inputChild">Add Event</button>

      </div>


      <DnDCalendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={ event => onSelectEvent(event) }
        onEventDrop={ onEventDrag }
        onEventResize={ onEventDrag }
        selectable
        resizable
        style={{ height: 500, margin: "50px" }} />
        </div>  
        }  
    </>
  )
}

export default MonthYear

