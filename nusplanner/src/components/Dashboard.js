import React, { useState, useEffect } from 'react'
import SideBar from "./Sidebar"
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, Timestamp, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./CSS/task.css"
import { BsFillTrashFill } from 'react-icons/bs';
import Popup from "./Popup"
import DateTimePicker from 'react-datetime-picker'
import format from "date-fns/format"
import TimePicker from 'react-time-picker';
import { Button, Modal, Form, Row, Col, Container, Dropdown, Offcanvas } from "react-bootstrap"
import  Select, { components } from 'react-select'

export default function Dashboard() {

  const tdyDate = new Date();

  //Get data from Firebase
  const userRef = doc(db, "Users", auth.currentUser.uid);
  const [stressData, setStressData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getAllEvents = async () => {
    const docu = await getDoc(userRef);
    setStressData(docu.data().stress);
    setFilteredStressData(docu.data().stress);
    setSleepData(docu.data().sleep);
    setFilteredSleepData(docu.data().sleep);
    setAllEvents(docu.data().events);
    setFilteredEventData(docu.data().events);
    setAllTags(docu.data().tags);
    setLoaded(true);
  }

  useEffect(() => {
    getAllEvents();
  }, [])

  //generate options for select
  var oneToTwelveArr = [{label:"all", value: 9999}];
  for (let i=1; i<=12; i++) {
    oneToTwelveArr.push({value: i, label: i});
  }

  const [tagsArr, setTagsArr] = useState([]);
  useEffect(() => {
    setTagsArr([]);
    allTags.map((t) => {
      setTagsArr(tagsArr => [...tagsArr, {value: t.value, label: t.value}])
    })
  }, [allTags])

  //Calculate average stress
  const calcStressAvg = (dat) => {
    var sum = 0;
    dat.forEach(function(i) {sum+=i.level})
    return (sum/dat.length).toFixed(2);
  }

  //Calculate average sleep hours
  const calcHoursAvg = (dat) => {
    var sum = 0;
    dat.forEach(function(i) {sum+=i.hours})
    return (sum/dat.length).toFixed(2);
  }

  //Calculate average sleep quality
  const calcQualityAvg = (dat) => {
    var sum = 0;
    dat.forEach(function(i) {sum+=i.quality})
    return (sum/dat.length).toFixed(2);
  }

  //Returns true if data is from past x months
  const filterMonths = (dat, x) => {
    var year = tdyDate.getFullYear();
    var month = tdyDate.getMonth();
    var date = tdyDate.getDate();
    while (x>month) {
      year -= 1;
      month += 12;
    }
    month -= x;
    return new Date(year, month, date)<dat.date.toDate();
  }

  //Check if event is a task
  const isTask = (event) => {
    if ( 
      event.end.toDate().getFullYear()===event.start.toDate().getFullYear() &&
      event.end.toDate().getMonth()===event.start.toDate().getMonth() &&
      event.end.toDate().getDate()===event.start.toDate().getDate() 
    ) 
    { return true }
    return false
  }

  //Checks if event is not from the future
  const isPast = (event) => {
    if (
      event.start.toDate() < tdyDate
    ) 
    { return true }
    return false
  }

  //Function to display stress level
  const [filteredStressData, setFilteredStressData] = useState([]);
  const handleSelectStressMonth = (v) => {
    setFilteredStressData([]);
    stressData.map((i) => {
      if (filterMonths(i, v)) {
        setFilteredStressData(filteredStressData => [...filteredStressData, i]);
      }
    })
  }

  //Function to display sleep hours and quality
  const [filteredSleepData, setFilteredSleepData] = useState([]);
  const handleSelectSleepMonth = (v) => {
    setFilteredSleepData([]);
    sleepData.map((i) => {
      if (filterMonths(i, v)) {
        setFilteredSleepData(filteredSleepData => [...filteredSleepData, i]);
      }
    })
  }

  //Handle select months for summary
  const [filteredEventData, setFilteredEventData] = useState([]);
  const handleSelectSummaryMonth = (v) => {
    setFilteredEventData([]);
    allEvents.map((i) => {
      if (filterMonths({date: i.start}, v)) {
        setFilteredEventData(filteredEventData => [...filteredEventData, i]);
      }
    })
  }
  useEffect(() => {
    handleDisplaySummary();
  }, [filteredEventData])

  //Handle select categories
  const [selectedCat, setSelectedCat] = useState([
    {value: "Work", label: "Work"},
    {value: "Extracurriculars", label: "Extracurriculars"},
    {value: "Academics", label: "Academics"}
  ]);
  const handleSelectCat = (v) => {
    setSelectedCat(v);
  }
  useEffect(() => {
    setTagsArr([]);
    allTags.map((t) => {
      setTagsArr(tagsArr => [...tagsArr, {value: t.value, label: t.value}])
    })
    handleDisplaySummary();
  }, [selectedCat])

  //Display summary
  const [selectedEvents, setSelectedEvents] = useState([]);
  const handleDisplaySummary = () => {
    setSelectedEvents([]);
    filteredEventData.map((i) => {
      selectedCat.map((c) => {
        if (i.category===c.value && isPast(i)) {
          setSelectedEvents(selectedEvents => [...selectedEvents, {category: i.category}])
        }
      })
    })
  }
  const countEvents = (cat, arr) => {
    let res = 0;
    arr.map((i) => {
      if (i.category===cat) {
        res += 1;
      }
    })
    return res;
  }

  //Handle select months for productivity
  const [eventsDone, setEventsDone] = useState(0);
  const handleSelectProductivityMonth = (v) => {
    let count = 0;
    let sum = 0;
    allEvents.map((i) => {
      if (filterMonths({date: i.start}, v) && i.done && isTask(i) && isPast(i)) {
        count += 1;
      }
      if (filterMonths({date: i.start}, v) && isTask(i) && isPast(i)) {
        sum += 1;
      }
    })
    setEventsDone(count/sum);
  } 
  useEffect(() => {
    handleSelectProductivityMonth(9999);
  }, [loaded])

  const logInfo = () => {
    console.log(typeof eventsDone)
  }

  return (
    <>
      <SideBar></SideBar>

      {loaded &&
      <div>
        <h3>Stress level:</h3>
        {calcStressAvg(filteredStressData)!=="NaN"
            ? <p>{calcStressAvg(filteredStressData)}</p>
            : <p>Start logging your stress level!</p> }
        <label>past &nbsp;</label>
        <Select 
          defaultValue={{label: "all", value: 9999}} 
          options={oneToTwelveArr}
          onChange={(event)=>handleSelectStressMonth(event.value)}
        />
        <label>&nbsp; months</label>
      </div>
      }
      {loaded &&
      <div>
        <h2>Sleep Analysis:</h2>
        <h3>Average Hours:</h3>
        {calcHoursAvg(filteredSleepData)!=="NaN"
            ? <p>{calcHoursAvg(filteredSleepData)}</p>
            : <p>Start logging your sleep hours!</p> }
        <h3>Average Quality:</h3>
        {calcQualityAvg(filteredSleepData)!=="NaN"
            ? <p>{calcQualityAvg(filteredSleepData)}</p>
            : <p>Start logging your sleep quality!</p> }
        <label>past &nbsp;</label>
        <Select 
          defaultValue={{label: "all", value: 9999}} 
          options={oneToTwelveArr}
          onChange={(event)=>handleSelectSleepMonth(event.value)}
        />
        <label>&nbsp; months</label>
      </div>
      } 

      {loaded &&
      <div>
        <h2>Summary:</h2>
        {selectedCat.map((cat) => {
          return (
            <>
              <div>{cat.value}: &nbsp;</div>
              {countEvents(cat.value, selectedEvents)!==0
            ? 
            <div>
            {countEvents(cat.value, selectedEvents)} (count) &nbsp;
            {(countEvents(cat.value, selectedEvents)/selectedEvents.length).toFixed(3)} (percentage)
            </div>
            : <div>{countEvents(cat.value, selectedEvents)} (count) &nbsp;</div> }
               
            </>
            
          )
        })}

        <label>Select categories:</label>
        <Select 
          defaultValue={[tagsArr[0], tagsArr[1], tagsArr[2]]} 
          options={tagsArr}
          isMulti
          onChange={handleSelectCat}  
          value={selectedCat}
        />

        <label>past &nbsp;</label>
        <Select 
          defaultValue={{label: "all", value: 9999}} 
          options={oneToTwelveArr}
          onChange={(event)=>handleSelectSummaryMonth(event.value)}
        />
        <label>&nbsp; months</label>

      </div>
      }

      {loaded &&
        <div>
          <h2>Productivity:</h2>
          {eventsDone.toString()!=="NaN"
            ? <p>{eventsDone.toFixed(3)}</p>
            : <p>Start logging your tasks!</p> }
          

          <label>past &nbsp;</label>
          <Select 
            defaultValue={{label: "all", value: 9999}} 
            options={oneToTwelveArr}
            onChange={(event)=>handleSelectProductivityMonth(event.value)}
          />
          <label>&nbsp; months</label>

        </div>
        }

    </>
  )
}