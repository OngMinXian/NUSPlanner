import React, { useState, useEffect } from 'react'
import SideBar from "./Sidebar"
import { addDoc, collection, getDocs, deleteDoc, doc, where, query } from "firebase/firestore";
import { db, auth } from "../firebase";

function ProgressReport() {

  const [title, setTitle] = useState("");
  const [task, setTask] = useState("");

  const [test, setTest] = useState([]);
  const test2 = [1,2,3,4,5];

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

  const delTask = async (id) => {
    const taskDoc = doc(db, "ToDoList", id);
    await deleteDoc(taskDoc);
    window.location.reload(false);
  };

  const getTasks = async () => {
    const data = await getDocs(taskRef);
    setTest(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  
  useEffect (() => {

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

      <div>
      {test.map((i) => (
        <div>
          <h1 key={i.id}>{i.id}-{i.title}:{i.task}</h1>
          <button onClick={() => delTask(i.id)}>X</button>
        </div>
        
      ))}
    </div>

    </div>
    </>
    
  )}

export default ProgressReport