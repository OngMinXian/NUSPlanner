//npm install --save react-big-calendar --legacy-peer-deps
//npm i react-datepicker
//npm i date-fns

/* CODE HERE IS THE SECOND ATTEMPT AT CALENDAR */
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
import DatePicker from "react-datepicker"

function Today() {

  /* Initialise calendar */
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
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" })
  const [allEvents, setAllEvents] = useState(events)

  /* Functions to handle events */
  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent])
  }

  return (

    <>
      <SideBar></SideBar>
      <h1 className="centerHeading">Calendar</h1>
      <h2 className="centerHeading">Add New Event</h2>
        <div className="eventInput">
          <input
            type="text"
            placeholder="Add Title"
            style={{ width: "20%" , marginRight: "10px" }} 
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
            className = "inputChild"/>

          <DatePicker
            placeholderText="Start Date"
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start })} 
            className = "inputChild"/>

          <DatePicker
            placeholderText="End Date"
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end })} 
            className = "inputChild"/>
        </div>

        <button style={{ marginTop: "10px"}} onClick={handleAddEvent} className = "centerButton">Add Event</button>

      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }} />
    </>
  )
}
export default Today

/* CODE BELOW IS THE FIRST ATTEMPT AT CALENDAR */


//npm install react-calendar

/* import SideBar from "./Sidebar"
import Calendar from 'react-calendar';
import styled from 'styled-components';

function Today() {
    return (
        <>
            <SideBar></SideBar>
            <h1 className = "centerHeading">Calendar</h1>
            <CalendarContainer>
                <Calendar calendarType='US' />
            </CalendarContainer>

        </>
    )
}

export default Today

const CalendarContainer = styled.div`

  max-width: 600px;
  margin: auto;
  margin-top: 20px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 3px;

  .react-calendar__navigation {
    display: flex;
    .react-calendar__navigation__label {
      font-weight: bold;
    }
    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }
  
  .react-calendar__month-view__weekdays {
    text-align: center;
  }
 
  button {
    margin: 3px;
    background-color: #60DCC6;
    border: 0;
    border-radius: 3px;
    color: white;
    padding: 5px 0;
    &:hover {
      background-color: #0A64BC; 
    }
    &:active {
      background-color: #60DCC6;
    }
  }
  
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%; 
    
    .react-calendar__tile {
      max-width: initial !important;
    }
    .react-calendar__tile--range {
      box-shadow: 0 0 6px 2px red;
    }
  }
  
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    color: white;
  }
  
  .react-calendar__year-view__months, .react-calendar__decade-view__years, .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;
    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }
    
    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`; 
*/
