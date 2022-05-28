import React, { useState, useEffect } from 'react'
import SideBar from "./Sidebar"
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./CSS/task.css"
import { BsFillTrashFill } from 'react-icons/bs';
import Popup from "./Popup"

function ProgressReport() {
    return (
      <></>
    )
  }

export default ProgressReport