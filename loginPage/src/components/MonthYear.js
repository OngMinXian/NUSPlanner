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
import { useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import DateTimePicker from 'react-datetime-picker'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" })

  /* Functions to handle events */
  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent])
  }

  function onEventDrag({ event, start, end }) {
    const idx = allEvents.indexOf(event)
    const updatedEvent = {...event, start, end}
    allEvents.splice(idx,1,updatedEvent)
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

  return (

    <>
      <SideBar></SideBar>
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
    </>
  )
}

export default MonthYear

