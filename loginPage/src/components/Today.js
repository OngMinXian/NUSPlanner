import React, { useState, useEffect } from 'react'
import SideBar from "./Sidebar"
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./CSS/task.css"
import { BsFillTrashFill } from 'react-icons/bs';
import Popup from "./Popup"

function Today() {

  const [isOpen, setIsOpen] = useState(false);

  const [task, setTask] = useState("");
  const [time, setTime] = useState("");

  const [allTask, setallTask] = useState([]);

  const col = collection(db, "ToDoList");

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const createTask = async (e) => {
    e.preventDefault();
    await addDoc(col, {
      task,
      time,
      userid: auth.currentUser.uid,
    });
    setTask("");
    window.location.reload(false);
  };

  const delTask = async (id) => {
    const taskDoc = doc(db, "ToDoList", id);
    await deleteDoc(taskDoc);
    window.location.reload(false);
  };
  
  useEffect (() => {
    const taskRef = query(col, where("userid", "==", auth.currentUser.uid), orderBy("time"))
    const getTasks = async () => {
      const data = await getDocs(taskRef);
      setallTask(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    return () => {
      getTasks();
    }  
  }, [])

  return (
    <>
      <SideBar></SideBar>

      <div className="box">
        
        <div>
        <button onClick={togglePopup} className="button-popup">+</button>
        {isOpen && <Popup content= {<>
          
      <div className='box popup' >
        <h1 style={{color:"#FFF"}} >Create A Task</h1>
        <div>
          <input
            placeholder='Task'
            onChange={(event) => {
              setTask(event.target.value); }}
              className="formInput"
              /><br></br>
          <input 
              placeholder='Time'
              type="time" onChange={(event) => {
              setTime(event.target.value);}} 
              className="formInput"
              />  
        </div>

        <button onClick={createTask} className="buttonGreen"> Create Task</button>
      </div>
        </>} handleClose={togglePopup} />}
    </div>
    <h1 style={{color:"#FFF"}}>Today's Tasks:</h1>
      {allTask.map((t) => {
        return (
        <>
        <div className="taskBox">
          <h2 className='text Task'>{t.task} &nbsp;</h2>
          <h2 className='text Time'>at {t.time}</h2>
          <button onClick={() => delTask(t.id)} className="buttonTransparent "><BsFillTrashFill /></button>
        </div>
        </>
        )
      
        })}
    </div>
    
    </>
    
  )
}

export default Today

