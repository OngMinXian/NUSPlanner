import React, { useEffect } from 'react'
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"

function CreateUserDoc() {

    const location = useLocation();
    const navigate = useNavigate()

    const createUser = async () => {
        await setDoc(doc(db, "Users", auth.currentUser.uid), 
        {
            username: location.state.usernameProp,
            email: location.state.emailProp,
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
                id: "3:#a8d5baff",
                value: "Academics",
                colour: "#a8d5baff",
              }, {
                id: "4:Others#3174ad",
                value: "Others",
                colour: "#3174ad",
            }
            ],
            stress: [
              // {date: new Date(2021, 5, 1), level: 0.5},
              // {date: new Date(2021, 5, 2), level: 0.5},
              // {date: new Date(2021, 5, 3), level: 1},
              // {date: new Date(2021, 5, 4), level: 1},
              // {date: new Date(2021, 5, 5), level: 1},
              // {date: new Date(2021, 5, 6), level: 1},
              // {date: new Date(2021, 5, 7), level: 0},
              // {date: new Date(2021, 5, 8), level: 0},
              // {date: new Date(2021, 5, 9), level: 0},
              // {date: new Date(2021, 5, 10), level: 0.5},
              // {date: new Date(2021, 5, 11), level: 0.5},
              // {date: new Date(2021, 5, 12), level: 0.5},

              // {date: new Date(2022, 5, 1), level: 1},
              // {date: new Date(2022, 5, 2), level: 1},
              // {date: new Date(2022, 5, 3), level: 1},
              // {date: new Date(2022, 5, 4), level: 1},
              // {date: new Date(2022, 5, 5), level: 1},
              // {date: new Date(2022, 5, 6), level: 1},
              // {date: new Date(2022, 5, 7), level: 1},
              // {date: new Date(2022, 5, 8), level: 1},
              // {date: new Date(2022, 5, 9), level: 1},
              // {date: new Date(2022, 5, 10), level: 1},
              // {date: new Date(2022, 5, 11), level: 1},
              // {date: new Date(2022, 5, 12), level: 1}
            ],
            sleep: [
              // {date: new Date(2021, 1, 1), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 2), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 3), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 4), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 5), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 6), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 7), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 8), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 9), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 10), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 11), hours: 8, quality: 1},
              // {date: new Date(2021, 1, 12), hours: 8, quality: 1},

              // {date: new Date(2022, 1, 1), hours: 3, quality: 0.5},
              // {date: new Date(2022, 1, 2), hours: 4, quality: 1},
              // {date: new Date(2022, 1, 3), hours: 5, quality: 0.5},
              // {date: new Date(2022, 1, 4), hours: 6, quality: 1},
              // {date: new Date(2022, 1, 5), hours: 7, quality: 1},
              // {date: new Date(2022, 1, 6), hours: 8, quality: 1},
              // {date: new Date(2022, 1, 7), hours: 10, quality: 0},
              // {date: new Date(2022, 1, 8), hours: 2, quality: 0},
              // {date: new Date(2022, 1, 9), hours: 4, quality: 1},
              // {date: new Date(2022, 1, 10), hours: 7, quality: 1},
              // {date: new Date(2022, 1, 11), hours: 3, quality: 0},
              // {date: new Date(2022, 1, 12), hours: 4, quality: 0},

              // {date: new Date(2022, 5, 1), hours: 8, quality: 1},
              // {date: new Date(2022, 5, 2), hours: 8, quality: 1},
              // {date: new Date(2022, 5, 3), hours: 7.5, quality: 0.5},
              // {date: new Date(2022, 5, 4), hours: 7.5, quality: 0.5},
              // {date: new Date(2022, 5, 5), hours: 6, quality: 0},
              // {date: new Date(2022, 5, 6), hours: 6, quality: 0},
              // {date: new Date(2022, 5, 7), hours: 6.5, quality: 0},
              // {date: new Date(2022, 5, 8), hours: 6, quality: 0},
              // {date: new Date(2022, 5, 9), hours: 8.5, quality: 0.5},
              // {date: new Date(2022, 5, 10), hours: 10, quality: 1},
              // {date: new Date(2022, 5, 11), hours: 10.5, quality: 1},
              // {date: new Date(2022, 5, 12), hours: 9, quality: 1}
            ],
        }) 
      };

    useEffect(() => {
        return () => {
            createUser();
            navigate("/");
          }       
    }, [])

  return (
    <>
    </>
  )
}

export default CreateUserDoc