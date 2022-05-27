import React, { useState, useEffect } from 'react'
import SideBar from "./Sidebar"
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./CSS/task.css"
import { BsFillTrashFill } from 'react-icons/bs';
import Popup from "./Popup"

function ProgressReport() {

  const [isOpen, setIsOpen] = useState(false);

  const [task, setTask] = useState("");
  const [time, setTime] = useState("");

  const [allTask, setallTask] = useState([]);

  const col = collection(db, "ToDoList");
  const taskRef = query(col, orderBy("time"));

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const createTask = async (e) => {
    e.preventDefault();
    await addDoc(taskRef, {
      task,
      time,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
    setTask("");
    window.location.reload(false);
  };

  const delTask = async (id) => {
    const taskDoc = doc(db, "ToDoList", id);
    await deleteDoc(taskDoc);
    window.location.reload(false);
  };

  const getTasks = async () => {
    const data = await getDocs(taskRef);
    setallTask(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  
  useEffect (() => {

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
              className="form_input"
              /><br></br>
          <input 
              placeholder='Time'
              type="time" onChange={(event) => {
              setTime(event.target.value);}} 
              className="form_input"
              />  
        </div>

        <button onClick={createTask} className="button-green"> Create Task</button>
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
    
  )}

export default ProgressReport