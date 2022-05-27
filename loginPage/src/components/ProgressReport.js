import React, { useState, useEffect } from 'react'
import SideBar from "./Sidebar"
import { addDoc, collection, getDocs, deleteDoc, doc, where, query } from "firebase/firestore";
import { db, auth } from "../firebase";

function ProgressReport() {

  const [title, setTitle] = useState("");
  const [task, setTask] = useState("");

  const taskRef = collection(db, "ToDoList");

  const createTask = async (e) => {
    e.preventDefault();
    await addDoc(taskRef, {
      title,
      task,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
    setTitle(""); 
    setTask("");
    window.location.reload(false);
  };
  
  useEffect (() => {
    const getTasks = async () => {
      const data = await getDocs(taskRef);
      data.forEach(doc => {
        console.log(doc.data());
    })
    }
    return () => {
      getTasks();
    }
    
  }, [])

  return (
    <>
      <SideBar></SideBar>
      <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Task</h1>
        <div className="inputGp">
          <label> Task:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label> Description:</label>
          <textarea
            placeholder="..."
            onChange={(event) => {
              setTask(event.target.value);
            }}
          />
        </div>
        <button onClick={createTask}> Create Task</button>
      </div>
    </div>

    <div>
      
    </div>
    </>
  )}

export default ProgressReport