import React, { useState, useEffect } from 'react'
import SideBar from "./Sidebar"
import {  doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import  Select from 'react-select'

function ProgressReport() {

  //Get data from Firebase
  const userRef = doc(db, "Users", auth.currentUser.uid);
  
  //Hooks for data retrieval
  const [noSems, setNoSems] = useState(0);
  const [semArr, setSemArr] = useState([]);
  const [allMods, setAllMods] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getAllData = async () => {
    const docu = await getDoc(userRef);
    setNoSems(docu.data().noOfSems);
    setAllMods(docu.data().modgradeinfo);
    setAllTags(docu.data().tags);
    setAllEvents(docu.data().events);
    setLoaded(true);
  }

  useEffect(() => {
    getAllData();
  }, [])

  useEffect(() => {
    for (let i=1; i<= noSems; i++) {
      setSemArr(semArr => [...semArr, i]);
    } 
  }, [noSems])

  //Cap calculator
  const calcOverallCAP = (arr) => {
    const gradeToCAP = {
      "A+": 5,
      "A": 5,
      "A-": 4.5,
      "B+": 4,
      "B": 3.5,
      "B-": 3,
      "C+": 2.5,
      "C": 2,
      "D+": 1.5,
      "D": 1,
      "F": 0,
    }
    var res = 0;
    var count = 0;
    arr.map((i) => {
      if ((i.grade!=="SU" && i.grade!=="")) {
        count += 1;
        res += gradeToCAP[i.grade];
      }
    })
    return (res/count).toFixed(2);
  }

  const calcCAP = (arr, s) => {
    const gradeToCAP = {
      "A+": 5,
      "A": 5,
      "A-": 4.5,
      "B+": 4,
      "B": 3.5,
      "B-": 3,
      "C+": 2.5,
      "C": 2,
      "D+": 1.5,
      "D": 1,
      "F": 0,
    }
    var res = 0;
    var count = 0;
    arr.map((i) => {
      if ((i.grade!=="SU" && i.grade!=="") && i.sem==s) {
        count += 1;
        res += gradeToCAP[i.grade];
      }
    })
    return (res/count).toFixed(2);
  }

  //Sort Modules
  const [sortedMods, setsortedMods] = useState([]);
  const modsSorter = () => {
    var gradeArr = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D+", "D", "F"]
    allMods.map((i) => {
      if (i.grade===gradeArr[0]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[1]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[2]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[3]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[4]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[5]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[6]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[7]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[8]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[9]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
    allMods.map((i) => {
      if (i.grade===gradeArr[10]) {
        setsortedMods(sortedMods => [...sortedMods, i]);
      }
    })
  }

  useEffect(() => {
    modsSorter();
  }, [allMods])

  //Generate tags as options
  const [tagsArr, setTagsArr] = useState([]);
  useEffect(() => {
    allTags.map((i) => {
      setTagsArr(tagsArr => [...tagsArr, {label: i.value, value: i.value}]);
    })
  }, [allTags])

  //Handle select category and display events of that category
  const [selectedEvents, setSelectedEvents] = useState([]);
  const handleSelectCat = (e) => {
    setSelectedEvents([]);
    allEvents.map((i) => {
      if (i.category===e.value) {
        setSelectedEvents(selectedEvents => [...selectedEvents, i]);
      }
    })
  }

  const logInfo = () => {
    console.log(allEvents)
    console.log(selectedEvents)
    console.log(sortedMods)
  }

    return (
      <>
      <SideBar></SideBar>

      {loaded && 
      <>

      {calcOverallCAP(allMods)!=="NaN"
            ? <h2>Overall CAP: {calcOverallCAP(allMods)}</h2>
            : <h2>Overall CAP: No Module/Grade Input</h2> }

      {semArr.map((i) => {
        return (
          <>
            {calcCAP(allMods, i)!=="NaN"
            ? <p>{i}: {calcCAP(allMods, i)}</p>
            : <p>{i}: No Module/Grade Input</p>}
          </>
        )
      })
      }
      <h3>Your best modules:</h3>
      {[...sortedMods].splice(0, 5).map((i) => {
        return (
          <>
            <p>Module Code: {i.code} Grade: {i.grade}</p>
          </>
        )  
      })}
      
      <h3>Your worst modules:</h3>
      {[...sortedMods].reverse().splice(0, 5).map((i) => {
        return (
          <>
            <p>Module Code: {i.code} Grade: {i.grade}</p>
          </>
        )  
      })}

      <label>Select category to display:</label>
      <Select
        options={tagsArr}
        onChange={(event) => handleSelectCat(event)}  
      />
      {selectedEvents.map((i) => {
        return (
          <>
          <h2>{i.title}</h2>
          <b>Description: </b> {i.description} <br></br>
          <b>Date: </b>  {i.start.toDate().toString()} to {i.end.toDate().toString()} <br></br>
          <b>Organisation name: </b> {i.orgName} <br></br>
          <b>Role in Organisation:</b> {i.orgRole} <br></br>
          <b>Description of Tasks: </b> {i.orgDesc} <br></br>
          </>
        )
      })}

      </>
      }

      </>
    )
  }

export default ProgressReport