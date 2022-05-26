//npm install react-calendar

import SideBar from "./Sidebar"
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
  /* ~~~ neighboring month & weekend styles ~~~ */
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
