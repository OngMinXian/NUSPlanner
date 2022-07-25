import React, { useEffect, useState } from 'react'
import { db, auth, storage } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, setDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom"
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"
import dp from "../images/defaultProfilePic.jpg"

function CreateUserDoc() {

  const tdyDate = new Date();
  const yr = tdyDate.getFullYear();
  const mth = tdyDate.getMonth();
  const day = tdyDate.getDate();

  const location = useLocation();
  const users = collection(db, "Users");
  const navigate = useNavigate()
  const [img, setImg] = useState(null);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
    //The maximum is exclusive and the minimum is inclusive
  }

  function getRandomString() {
    let length = getRandomInt(1, 11);
    let res = "";
    for (let i=0; i<length; i++) {
      res += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[getRandomInt(0, 62)];
    }
    return res;
  }

  const cats = ["Extracurriculars", "Work", "Academics", "Others"]
  const catsColors = ["#8bbee8ff", "#d7a9e3ff", "#a8d5baff", "#3174ad"]

  const eventData = [
    // /* CCA TEST CASES HERE */
    // {
    //   category: "Extracurriculars",
    //   colour: "8bbee8ff",
    //   title: "title",
    //   description: "des",
    //   orgName: "orgName",
    //   orgRole: "orgRole",
    //   start: new Date(yr, mth, day),
    //   end: new Date(yr, mth, day + 5),
    //   done: false
    // },
    // {
    //   //PAST YEAR - PRESENT YEAR (AFTER TODAY)
    //   category: "Extracurriculars",
    //   colour: "8bbee8ff",
    //   title: "ccaevent1",
    //   description: "ccaDesc1",
    //   orgName: "ccaName1",
    //   orgRole: "ccaRole",
    //   start: new Date(2021, 3, 17),
    //   end: new Date(2022, 6, 29),
    //   done: false
    // },
    // {
    //   //PRESENT YEAR (BEFORE TODAY) - PRESENT YEAR (BEFORE TODAY)
    //   category: "Extracurriculars",
    //   colour: "8bbee8ff",
    //   title: "ccaevent2",
    //   description: "ccaDesc2",
    //   orgName: "ccaName2",
    //   orgRole: "ccaRole2",
    //   start: new Date(2022, 4, 17),
    //   end: new Date(2022, 5, 7),
    //   done: false
    // },
    // {
    //   //OUTLIER -> START DATE > CURRENT DAY
    //   category: "Extracurriculars",
    //   colour: "8bbee8ff",
    //   title: "ccaevent3",
    //   description: "ccaDesc3",
    //   orgName: "ccaName3 (OUTLIER)",
    //   orgRole: "ccaRole3",
    //   start: new Date(2022, 9, 17),
    //   end: new Date(2023, 5, 7),
    //   done: false
    // },
    // {//NO ORG NAME, NO ORG ROLE, NO ORG DESC
    //   category: "Extracurriculars",
    //   colour: "8bbee8ff",
    //   title: "ccaevent4",
    //   description: "",
    //   orgName: "",
    //   orgRole: "",
    //   start: new Date(2022, 4, 17),
    //   end: new Date(2022, 5, 7),
    //   done: false
    // },

    // /* WORK TEST CASES HERE */
    // {
    //   category: "Work",
    //   colour: "8bbee8ff",
    //   title: "title",
    //   description: "des",
    //   orgName: "orgName",
    //   orgRole: "orgRole",
    //   start: new Date(yr, mth, day),
    //   end: new Date(yr, mth, day + 5),
    //   done: false
    // },
    // {
    //   //PAST YEAR - PRESENT YEAR (AFTER TODAY)
    //   category: "Work",
    //   colour: "8bbee8ff",
    //   title: "workevent1",
    //   description: "workDesc1",
    //   orgName: "workName1",
    //   orgRole: "workRole",
    //   start: new Date(2021, 3, 17),
    //   end: new Date(2022, 6, 29),
    //   done: false
    // },
    // {
    //   //PRESENT YEAR (BEFORE TODAY) - PRESENT YEAR (BEFORE TODAY)
    //   category: "Work",
    //   colour: "8bbee8ff",
    //   title: "workevent2",
    //   description: "workDesc2",
    //   orgName: "workName2",
    //   orgRole: "workRole2",
    //   start: new Date(2022, 4, 17),
    //   end: new Date(2022, 5, 7),
    //   done: false
    // },
    // {
    //   //OUTLIER -> START DATE > CURRENT DAY
    //   category: "Work",
    //   colour: "8bbee8ff",
    //   title: "workevent3",
    //   description: "ccaDesc3",
    //   orgName: "workName3 (OUTLIER)",
    //   orgRole: "workRole3",
    //   start: new Date(2022, 9, 17),
    //   end: new Date(2023, 5, 7),
    //   done: false
    // },
    // {//NO ORG NAME, NO ORG ROLE, NO ORG DESC
    //   category: "Work",
    //   colour: "8bbee8ff",
    //   title: "workevent4",
    //   description: "",
    //   orgName: "",
    //   orgRole: "",
    //   start: new Date(2022, 4, 17),
    //   end: new Date(2022, 5, 7),
    //   done: false
    // },

    // /* ACADEMICS TEST CASES HERE */
    // {
    //   category: "Academics",
    //   colour: "8bbee8ff",
    //   title: "title",
    //   description: "des",
    //   orgName: "orgName",
    //   orgRole: "orgRole",
    //   start: new Date(yr, mth, day),
    //   end: new Date(yr, mth, day + 5),
    //   done: false
    // },
    // {
    //   //PAST YEAR - PRESENT YEAR (AFTER TODAY)
    //   category: "Academics",
    //   colour: "8bbee8ff",
    //   title: "acadevent1",
    //   description: "acadDesc1",
    //   orgName: "acadName1",
    //   orgRole: "acadRole",
    //   start: new Date(2021, 3, 17),
    //   end: new Date(2022, 6, 29),
    //   done: false
    // },
    // {
    //   //PRESENT YEAR (BEFORE TODAY) - PRESENT YEAR (BEFORE TODAY)
    //   category: "Academics",
    //   colour: "8bbee8ff",
    //   title: "acadevent2",
    //   description: "acadDesc2",
    //   orgName: "acadName2",
    //   orgRole: "acadRole2",
    //   start: new Date(2022, 4, 17),
    //   end: new Date(2022, 5, 7),
    //   done: false
    // },
    // {
    //   //OUTLIER -> START DATE > CURRENT DAY
    //   category: "Academics",
    //   colour: "8bbee8ff",
    //   title: "acadevent3",
    //   description: "acadDesc3",
    //   orgName: "acadName3 (OUTLIER)",
    //   orgRole: "acadRole3",
    //   start: new Date(2022, 9, 17),
    //   end: new Date(2023, 5, 7),
    //   done: false
    // },
    // {//NO ORG NAME, NO ORG ROLE, NO ORG DESC
    //   category: "Academics",
    //   colour: "8bbee8ff",
    //   title: "acadevent4",
    //   description: "",
    //   orgName: "",
    //   orgRole: "",
    //   start: new Date(2022, 4, 17),
    //   end: new Date(2022, 5, 7),
    //   done: false
    // }
  ];

  for (let i=5; i>0; i--) {

    let randInt = getRandomInt(0, 4);
    let randHr = getRandomInt(0, 24);
    let randMin = getRandomInt(0, 60);
    
    eventData.push({
      //RANDOM EVENT GENERATOR THAT OCCURS OVER TODAY
      category: cats[randInt],
      colour: catsColors[randInt],
      title: getRandomString(),
      description: getRandomString(),
      orgName: getRandomString(),
      orgRole: getRandomString(),
      start: new Date(yr, mth, day-getRandomInt(0, 32), randHr, randMin),
      end: new Date(yr, mth, day+getRandomInt(0, 32), randHr, randMin),
      done: [true, true, true, true, false][getRandomInt(0, 5)],
      PR: [true, false, false, false, false][getRandomInt(0, 5)]
    })

  }

  for (let i=100; i>0; i--) {

    let randInt = getRandomInt(0, 4);
    let randYr = getRandomInt(0, 4);
    let randMth = getRandomInt(0, 12);
    let randDay = getRandomInt(1, 29);
    let randDuration = getRandomInt(0, 29)
    let randHr = getRandomInt(0, 24);
    let randMin = getRandomInt(0, 60);
    
    eventData.push({
      //RANDOM EVENT GENERATOR THAT OCCURS IN THE PAST
      category: cats[randInt],
      colour: catsColors[randInt],
      title: getRandomString(),
      description: getRandomString(),
      orgName: getRandomString(),
      orgRole: getRandomString(),
      start: new Date(yr-randYr, mth-randMth, day-randDay-randDuration, randHr, randMin),
      end: new Date(yr-randYr, mth-randMth, day-randDay, randHr, randMin),
      done: [true, true, true, true, false][getRandomInt(0, 5)],
      PR: [true, false, false, false, false][getRandomInt(0, 5)]
    })

    randInt = getRandomInt(0, 4);
    randYr = getRandomInt(0, 4);
    randMth = getRandomInt(0, 12);
    randDay = getRandomInt(1, 29);
    randDuration = getRandomInt(0, 29)
    randHr = getRandomInt(0, 24);
    randMin = getRandomInt(0, 60);

    eventData.push({
      //RANDOM EVENT GENERATOR THAT OCCURS IN THE FUTURE
      category: cats[randInt],
      colour: catsColors[randInt],
      title: getRandomString(),
      description: getRandomString(),
      orgName: getRandomString(),
      orgRole: getRandomString(),
      start: new Date(yr+randYr, mth+randMth, day+randDay, randHr, randMin),
      end: new Date(yr+randYr, mth+randMth, day+randDay+randDuration, randHr, randMin),
      done: [true, true, true, true, false][getRandomInt(0, 5)],
      PR: [true, false, false, false, false][getRandomInt(0, 5)]
    })

  }

  for (let i=5; i>0; i--) {

    let randInt = getRandomInt(0, 4);
    let randHr = getRandomInt(0, 24);
    let randMin = getRandomInt(0, 60);
    
    eventData.push({
      //RANDOM TASK GENERATOR THAT OCCURS OVER TODAY
      category: cats[randInt],
      colour: catsColors[randInt],
      title: getRandomString(),
      description: getRandomString(),
      orgName: getRandomString(),
      orgRole: getRandomString(),
      start: new Date(yr, mth, day, randHr, randMin),
      end: new Date(yr, mth, day, randHr+getRandomInt(0, 24-randHr), randMin+getRandomInt(1, 60-randMin)),
      done: [true, true, true, true, false][getRandomInt(0, 5)],
      PR: [true, false, false, false, false][getRandomInt(0, 5)]
    })
  }

  for (let i=100; i>0; i--) {

    let randInt = getRandomInt(0, 4);
    let randYr = getRandomInt(0, 2);
    let randMth = getRandomInt(0, 12);
    let randDay = getRandomInt(1, 29);
    let randHr = getRandomInt(0, 24);
    let randMin = getRandomInt(0, 60);
    
    eventData.push({
      //RANDOM TASK GENERATOR THAT OCCURS IN THE PAST
      category: cats[randInt],
      colour: catsColors[randInt],
      title: getRandomString(),
      description: getRandomString(),
      orgName: getRandomString(),
      orgRole: getRandomString(),
      start: new Date(yr-randYr, mth-randMth, day-randDay, randHr, randMin),
      end: new Date(yr-randYr, mth-randMth, day-randDay, randHr+getRandomInt(0, 24-randHr), randMin+getRandomInt(1, 60-randMin)),
      done: [true, true, true, true, false][getRandomInt(0, 5)],
      PR: [true, false, false, false, false][getRandomInt(0, 5)]
    })

    randInt = getRandomInt(0, 4);
    randYr = getRandomInt(0, 2);
    randMth = getRandomInt(0, 12);
    randDay = getRandomInt(1, 29); 
    randHr = getRandomInt(0, 24);
    randMin = getRandomInt(0, 60);

    eventData.push({
      //RANDOM TASK GENERATOR THAT OCCURS IN THE FUTURE
      category: cats[randInt],
      colour: catsColors[randInt],
      title: getRandomString(),
      description: getRandomString(),
      orgName: getRandomString(),
      orgRole: getRandomString(),
      start: new Date(yr+randYr, mth+randMth, day+randDay, randHr, randMin),
      end: new Date(yr+randYr, mth+randMth, day+randDay, randHr+getRandomInt(0, 24-randHr), randMin+getRandomInt(1, 60-randMin)),
      done: [true, true, true, true, false][getRandomInt(0, 5)],
      PR: [true, false, false, false, false][getRandomInt(0, 5)]
    })

  }

  const stressData = [];
  for (let i=365; i>=1; i--) {
    const tempTag = [];
    for (let i=[1,1,1,1,1,1,1, 2,2,2,2,2, 3,3,3, 4, 5, 6][getRandomInt(0, [1,1,1,1,1,1,1, 2,2,2,2,2, 3,3,3, 4, 5, 6].length)]; i>=0; i--) {
      tempTag.push(["Studying", "Work + Intern", "CCA", "Exercising", "Socialising", "Leisure"][getRandomInt(0, 6)]);
    }
    stressData.push({
      date: new Date(yr, mth, day-i),
      level: [1,1, 2,2,2, 3,3,3,3,3, 4,4,4,4,4,4,4, 5,5,5,5,5,5,5,5,5][getRandomInt(0,
         [1,1, 2,2,2, 3,3,3,3,3, 4,4,4,4,4,4,4, 5,5,5,5,5,5,5,5,5].length)],
      tag: tempTag,
    })
  }

  const sleepData = [];
  for (let i=365; i>=1; i--) {
    sleepData.push({
      date: new Date(yr, mth, day-i),
      quality: [1,1, 2,2,2,2,2,2, 3,3,3,3,3,3,3,3,3,3,3,3][getRandomInt(0, [1,1, 2,2,2,2,2,2, 3,3,3,3,3,3,3,3,3,3,3,3].length)],
      hours: [
        0, 
        0.5, 
        1, 
        1.5, 
        2, 
        2.5, 
        3, 
        3.5, 
        4, 4,
        4.5, 4.5,
        5, 5, 5, 
        5.5, 5.5, 5.5, 5.5,
        6, 6, 6, 6, 6, 6, 6, 6, 
        6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5,
        7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 
        7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5,
        9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
        9.5, 9.5, 9.5, 9.5, 9.5, 9.5,
        10, 10, 10, 10, 10,
        10.5, 10.5,
        11, 11, 
        11.5, 11.5, 
        12, 
        12.5, 
        13, 
        13.5, 
        14, 
        14.5, 
        15, 
        15.5, 
        16, 
        16.5, 
        17, 
        17.5, 
        18, 
        18.5, 
        19, 
        19.5, 
        20, 
        20.5, 
        21, 
        21.5,  
        22, 
        22.5, 
        23, 
        23.5, 
        24
        ][getRandomInt(0, [
          0, 
        0.5, 
        1, 
        1.5, 
        2, 
        2.5, 
        3, 
        3.5, 
        4, 4,
        4.5, 4.5,
        5, 5, 5, 
        5.5, 5.5, 5.5, 5.5,
        6, 6, 6, 6, 6, 6, 6, 6, 
        6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5,
        7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 
        7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5,
        9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
        9.5, 9.5, 9.5, 9.5, 9.5, 9.5,
        10, 10, 10, 10, 10,
        10.5, 10.5,
        11, 11, 
        11.5, 11.5, 
        12, 
        12.5, 
        13, 
        13.5, 
        14, 
        14.5, 
        15, 
        15.5, 
        16, 
        16.5, 
        17, 
        17.5, 
        18, 
        18.5, 
        19, 
        19.5, 
        20, 
        20.5, 
        21, 
        21.5,  
        22, 
        22.5, 
        23, 
        23.5, 
        24
        ].length)],
    })
  }

  const getRandomCode = () => {
    return ["CS", "MA", "GE", "BBA", "ACC", "FIN", "IT", "DAO"][getRandomInt(0, ["CS", "MA", "GE", "BBA", "ACC", "FIN", "IT", "DAO"].length)]
  }

  const getRandomGrade = () => {
    return [
      "A+", "A+",
      "A", "A", "A", "A", "A", "A", "A", "A", 
      "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-",
      "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", 
      "B", "B", "B", "B", "B", "B", "B", "B", "B", "B",
      "B-", "B-", "B-", "B-", "B-", "B-", "B-",
      "C+", "C+", "C+",
      "C",
      "D+",
      "D",
      "F",
      "SU", "SU",
    ][getRandomInt(0, [
      "A+", "A+",
      "A", "A", "A", "A", "A", "A", "A", "A",
      "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-", "A-",
      "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", "B+", 
      "B", "B", "B", "B", "B", "B", "B", "B", "B", "B",
      "B-", "B-", "B-", "B-", "B-", "B-", "B-",
      "C+", "C+", "C+",
      "C",
      "D+",
      "D",
      "F",
      "SU", "SU",
    ].length)]
  }

  const modsData = [];
  for (let i=5; i>=0; i--) {
    for (let j=5; j>0; j--) {
      modsData.push({
        code: getRandomCode()+(i*j),
        grade: getRandomGrade(),
        sem: i,
      })
    }
  }

  const createUser = async () => {
    if (location.state.usernameProp==="tester") {
      await setDoc(doc(db, "Users", auth.currentUser.uid),
      {
        username: location.state.usernameProp,
        email: location.state.emailProp,
        linkedin: "",
        website: "",
        selfdescription: "",
        faculty: "",
        course: "",
        matricyear: "",
        gradyear: "",
        picSet: false,
        noOfSems: 8,
        modgradeinfo: modsData,
          // {code: "CS1", grade: "A", sem: 1},
          // {code: "ST1", grade: "A-", sem: 1},
          // {code: "CS2", grade: "A", sem: 1},
          // {code: "ST2", grade: "A-", sem: 1},
          // {code: "GE1", grade: "B+", sem: 1},

          // {code: "CS3", grade: "B+", sem: 2},
          // {code: "GE2", grade: "A", sem: 2},
          // {code: "CS4", grade: "B+", sem: 2},
          // {code: "ST3", grade: "B", sem: 2},
          // {code: "IS1", grade: "B-", sem: 2},

          // {code: "CS5", grade: "A", sem: 3},
          // {code: "ST4", grade: "A", sem: 3},
          // {code: "IS2", grade: "A", sem: 3},
          // {code: "CS6", grade: "C", sem: 3},
          // {code: "IS3", grade: "C", sem: 3},

          // {code: "LSM1", grade: "C", sem: 4},
          // {code: "CS7", grade: "A-", sem: 4},
          // {code: "MA1", grade: "SU", sem: 4},
          // {code: "EC1", grade: "A", sem: 4},
          // {code: "ZB1", grade: "A+", sem: 4},

          // {code: "LSM2", grade: "C", sem: 5},
          // {code: "CS8", grade: "C+", sem: 5},
          // {code: "MA2", grade: "SU", sem: 5},
          // {code: "EC2", grade: "D", sem: 5},
          // {code: "ZB2", grade: "A+", sem: 5},
          // {code: "ZB3", grade: "A-", sem: 5},

          // {code: "CS9", grade: "Not taken", sem: 6},

        lastpage: 1,
        profileLastLeftOff: "accountSettings",
        events: eventData,
        tags: [
          {
            id: "1:Work#d7a9e3ff",
            value: "Work",
            colour: "#d7a9e3ff",
          }, {
            id: "2:Extracurriculars#8bbee8ff",
            value: "Extracurriculars",
            colour: "#8bbee8ff",
          }, {
            id: "3:Academics#a8d5baff",
            value: "Academics",
            colour: "#a8d5baff",
          }, {
            id: "4:Others#3174ad",
            value: "Others",
            colour: "#3174ad",
          }
        ],
        stress: stressData,
          // {date: new Date(yr, mth, day-1), level: 5, tag: ["Studying"]},
          // {date: new Date(yr, mth, day-2), level: 5, tag: ["Work + Intern"]},
          // {date: new Date(yr, mth, day-3), level: 4, tag: ["CCA"]},
          // {date: new Date(yr, mth, day-4), level: 4, tag: ["Exercising"]},
          // {date: new Date(yr, mth, day-5), level: 4, tag: ["Socialising"]},
          // {date: new Date(yr, mth, day-6), level: 3, tag: ["Leisure"]},

          // {date: new Date(yr, mth, day-7), level: 2, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth, day-8), level: 3, tag: ["Studying", "Work + Intern"]},
          // {date: new Date(yr, mth, day-9), level: 1, tag: ["Studying"]},
          // {date: new Date(yr, mth, day-10), level: 5, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth, day-11), level: 1, tag: ["Studying", "Work + Intern"]},
          // {date: new Date(yr, mth, day-12), level: 3, tag: ["Studying"]},
          // {date: new Date(yr, mth, day-13), level: 5, tag: ["Studying", "Work + Intern"]},
          // {date: new Date(yr, mth, day-14), level: 3, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth, day-15), level: 1, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth, day-16), level: 2, tag: ["Studying", "Work + Intern"]},
          // {date: new Date(yr, mth, day-17), level: 4, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth, day-18), level: 3, tag: ["Studying"]},
          // {date: new Date(yr, mth, day-19), level: 4, tag: ["Studying", "Work + Intern"]},
          // {date: new Date(yr, mth, day-20), level: 3, tag: ["Studying", "Exercising"]},
          // {date: new Date(yr, mth, day-21), level: 4, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth, day-22), level: 2, tag: ["Studying", "Exercising"]},
          // {date: new Date(yr, mth, day-23), level: 4, tag: ["Studying", "Work + Intern"]},
          // {date: new Date(yr, mth, day-24), level: 1, tag: ["Studying"]},
          // {date: new Date(yr, mth, day-25), level: 1, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth, day-26), level: 5, tag: ["Studying", "Leisure"]},

          // {date: new Date(yr, mth-1, day), level: 1, tag: ["Studying"]},
          // {date: new Date(yr, mth-2, day), level: 1, tag: ["Studying", "Leisure", "Work + Intern"]},
          // {date: new Date(yr, mth-3, day), level: 2, tag: ["Studying"]},
          // {date: new Date(yr, mth-4, day), level: 3, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth-5, day), level: 2, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth-6, day), level: 1, tag: ["Studying", "Work + Intern"]},
          // {date: new Date(yr, mth-7, day), level: 3, tag: ["Studying", "Leisure"]},
          // {date: new Date(yr, mth-8, day), level: 1, tag: ["Studying", "Socialising"]},
          // {date: new Date(yr, mth-9, day), level: 2, tag: ["Studying", "Socialising"]},
          // {date: new Date(yr, mth-10, day), level: 2, tag: ["Studying", "Socialising", "Leisure"]},
          // {date: new Date(yr, mth-11, day), level: 4, tag: ["Studying", "Socialising"]},
          // {date: new Date(yr, mth-1, day-1), level: 4, tag: ["Studying", "Socialising", "Leisure"]},
          // {date: new Date(yr, mth-2, day-1), level: 3, tag: ["Studying", "Socialising"]},
          // {date: new Date(yr, mth-3, day-1), level: 2, tag: ["Studying", "Socialising"]},
          // {date: new Date(yr, mth-4, day-1), level: 1, tag: ["Studying", "Socialising", "Work + Intern"]},
          // {date: new Date(yr, mth-5, day-1), level: 1, tag: ["Studying", "Socialising"]},
          // {date: new Date(yr, mth-6, day-1), level: 1, tag: ["Studying", "Socialising"]},
          // {date: new Date(yr, mth-7, day-1), level: 1, tag: ["Studying", "Socialising", "Leisure"]},
          // {date: new Date(yr, mth-8, day-1), level: 1, tag: ["Studying", "Socialising", "Work + Intern", "Leisure"]},
          // {date: new Date(yr, mth-9, day-1), level: 3, tag:["Studying", "Socialising"]},
          // {date: new Date(yr, mth-10, day-1), level: 4, tag: ["Studying", "Socialising"]},
          // {date: new Date(yr, mth-11, day-1), level: 4, tag: ["CCA"]},
          // {date: new Date(yr, mth-1, day-2), level: 3, tag: ["CCA", "Work + Intern"]},
          // {date: new Date(yr, mth-2, day-2), level: 2, tag: ["CCA"]},
          // {date: new Date(yr, mth-3, day-2), level: 1, tag: ["CCA", "Leisure"]},
          // {date: new Date(yr, mth-4, day-2), level: 3, tag: ["CCA", "Work + Intern"]},
          // {date: new Date(yr, mth-5, day-2), level: 4, tag: ["CCA", "Leisure"]},
          // {date: new Date(yr, mth-6, day-2), level: 5, tag: ["CCA", "Leisure"]},
          // {date: new Date(yr, mth-7, day-2), level: 3, tag: ["CCA"]},
          // {date: new Date(yr, mth-8, day-2), level: 1, tag: ["CCA", "Work + Intern"]},
          // {date: new Date(yr, mth-9, day-2), level: 3, tag: ["CCA"]},
          // {date: new Date(yr, mth-10, day-2), level: 1, tag: ["CCA", "Work + Intern"]},
          // {date: new Date(yr, mth-11, day-2), level: 4, tag: ["CCA", "Work + Intern"]},

          // {date: new Date(yr-2, mth-1, day), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-2, day), level: 3, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-3, day), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-4, day), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-5, day), level: 2, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-6, day), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-7, day), level: 3, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-8, day), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-9, day), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-10, day), level: 2, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-11, day), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-1, day-1), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-2, day-1), level: 3, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-3, day-1), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-4, day-1), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-5, day-1), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-6, day-1), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-7, day-1), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-8, day-1), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-9, day-1), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-10, day-1), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-11, day-1), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-1, day-2), level: 3, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-2, day-2), level: 2, tag: ["CCA"]},
          // {date: new Date(yr-2, mth-3, day-2), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-4, day-2), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-5, day-2), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-6, day-2), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-7, day-2), level: 3, tag: ["CCA"]},
          // {date: new Date(yr-2, mth-8, day-2), level: 4, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-9, day-2), level: 3, tag: ["CCA"]},
          // {date: new Date(yr-2, mth-10, day-2), level: 5, tag: ["Studying"]},
          // {date: new Date(yr-2, mth-11, day-2), level: 4, tag: ["Studying"]}

        sleep: sleepData,
          // {date: new Date(yr, mth, day-1), hours: 8, quality: 3},
          // {date: new Date(yr, mth, day-2), hours: 7, quality: 3},
          // {date: new Date(yr, mth, day-3), hours: 5, quality: 3},
          // {date: new Date(yr, mth, day-4), hours: 3, quality: 1},
          // {date: new Date(yr, mth, day-5), hours: 5, quality: 2},
          // {date: new Date(yr, mth, day-6), hours: 8, quality: 3},

          // {date: new Date(yr, mth, day-7), hours: 12, quality: 3},
          // {date: new Date(yr, mth, day-8), hours: 11, quality: 1},
          // {date: new Date(yr, mth, day-9), hours: 8, quality: 3},
          // {date: new Date(yr, mth, day-10), hours: 7, quality: 1},
          // {date: new Date(yr, mth, day-11), hours: 6, quality: 2},
          // {date: new Date(yr, mth, day-12), hours: 5, quality: 2},
          // {date: new Date(yr, mth, day-13), hours: 3, quality: 2},
          // {date: new Date(yr, mth, day-14), hours: 2, quality: 2},
          // {date: new Date(yr, mth, day-15), hours: 5, quality: 3},
          // {date: new Date(yr, mth, day-16), hours: 9, quality: 2},
          // {date: new Date(yr, mth, day-17), hours: 10, quality: 2},
          // {date: new Date(yr, mth, day-18), hours: 11, quality: 3},
          // {date: new Date(yr, mth, day-19), hours: 12, quality: 3},
          // {date: new Date(yr, mth, day-20), hours: 14, quality: 1},
          // {date: new Date(yr, mth, day-21), hours: 12, quality: 1},
          // {date: new Date(yr, mth, day-22), hours: 8, quality: 3},
          // {date: new Date(yr, mth, day-23), hours: 9, quality: 2},
          // {date: new Date(yr, mth, day-24), hours: 5, quality: 1},
          // {date: new Date(yr, mth, day-25), hours: 5.5, quality: 1},
          // {date: new Date(yr, mth, day-26), hours: 7, quality: 1},
          // {date: new Date(yr, mth, day-27), hours: 3, quality: 3},
          // {date: new Date(yr, mth, day-28), hours: 4, quality: 2},
          // {date: new Date(yr, mth, day-29), hours: 5, quality: 2},
          // {date: new Date(yr, mth, day-30), hours: 2, quality: 2},

          // {date: new Date(yr, mth-1, day), hours: 8, quality: 3},
          // {date: new Date(yr, mth-2, day), hours: 8.5, quality: 3},
          // {date: new Date(yr, mth-3, day), hours: 7, quality: 2},
          // {date: new Date(yr, mth-4, day), hours: 7, quality: 1},
          // {date: new Date(yr, mth-5, day), hours: 6, quality: 2},
          // {date: new Date(yr, mth-6, day), hours: 5, quality: 3},
          // {date: new Date(yr, mth-7, day), hours: 7, quality: 3},
          // {date: new Date(yr, mth-8, day), hours: 8, quality: 3},
          // {date: new Date(yr, mth-9, day), hours: 9, quality: 1},
          // {date: new Date(yr, mth-10, day), hours: 5, quality: 1},
          // {date: new Date(yr, mth-11, day), hours: 3, quality: 1},
          // {date: new Date(yr, mth-1, day-1), hours: 2, quality: 2},
          // {date: new Date(yr, mth-2, day-1), hours: 5, quality: 2},
          // {date: new Date(yr, mth-3, day-1), hours: 5, quality: 2},
          // {date: new Date(yr, mth-4, day-1), hours: 6, quality: 2},
          // {date: new Date(yr, mth-5, day-1), hours: 6, quality: 3},
          // {date: new Date(yr, mth-6, day-1), hours: 6, quality: 3},
          // {date: new Date(yr, mth-7, day-1), hours: 6.5, quality: 1},
          // {date: new Date(yr, mth-8, day-1), hours: 4, quality: 2},
          // {date: new Date(yr, mth-9, day-1), hours: 3, quality: 2},
          // {date: new Date(yr, mth-10, day-1), hours: 2, quality: 3},
          // {date: new Date(yr, mth-11, day-1), hours: 4, quality: 3},
          // {date: new Date(yr, mth-1, day-2), hours: 8, quality: 1},
          // {date: new Date(yr, mth-2, day-2), hours: 9, quality: 2},
          // {date: new Date(yr, mth-3, day-2), hours: 10, quality: 3},
          // {date: new Date(yr, mth-4, day-2), hours: 11, quality: 2},
          // {date: new Date(yr, mth-5, day-2), hours: 8, quality: 1},
          // {date: new Date(yr, mth-6, day-2), hours: 8.5, quality: 3},
          // {date: new Date(yr, mth-7, day-2), hours: 5, quality: 2},
          // {date: new Date(yr, mth-8, day-2), hours: 5, quality: 3},
          // {date: new Date(yr, mth-9, day-2), hours: 4, quality: 1},
          // {date: new Date(yr, mth-10, day-2), hours: 3, quality: 2},
          // {date: new Date(yr, mth-11, day-2), hours: 2, quality: 2}
      })
    }
  
    else {
      await setDoc(doc(db, "Users", auth.currentUser.uid),
      {
        username: location.state.usernameProp,
        email: location.state.emailProp,
        linkedin: "",
        website: "",
        selfdescription: "",
        faculty: "",
        course: "",
        matricyear: "",
        gradyear: "",
        picSet: false,
        noOfSems: 8,
        modgradeinfo: [],
        lastpage: 0,
        profileLastLeftOff: "accountSettings",
        events: [],
        tags: [
          {
            id: "1:Work#d7a9e3ff",
            value: "Work",
            colour: "#d7a9e3ff",
          }, {
            id: "2:Extracurriculars#8bbee8ff",
            value: "Extracurriculars",
            colour: "#8bbee8ff",
          }, {
            id: "3:Academics#a8d5baff",
            value: "Academics",
            colour: "#a8d5baff",
          }, {
            id: "4:Others#3174ad",
            value: "Others",
            colour: "#3174ad",
          }
        ],
        stress: [],
        sleep: [],
      })
    }
    
  };

  useEffect(() => {
    createUser();
    navigate("/");
  }, [])

  return (
    <>
    </>
  )
}

export default CreateUserDoc