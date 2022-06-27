import { React, useState, useEffect } from 'react'
import { Table, Button, ButtonGroup, Form, Row, Col, InputGroup } from "react-bootstrap";
import { db, auth } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, where, query, orderBy, getDoc, updateDoc } from "firebase/firestore";
import { BsFillTrashFill } from 'react-icons/bs';
import Select from 'react-select'
import "./CSS/editgrades.css"

export default function EditModAndCap() {

  const userRef = doc(db, "Users", auth.currentUser.uid);
  const [noSems, setNoSems] = useState(0);
  const [currentSem, setCurrentSem] = useState(0);
  const [allMods, setAllMods] = useState([]);
  const [changed, setChanged] = useState(false);
  const [updatedMods, setUpdatedMods] = useState([]);
  const [apply, setApply] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [tempMods, setTempMods] = useState([]);

  //Options for grades select bar 
  const gradeOptions = [
    { value: ' ', label: 'Not taken' },
    { value: 'A+', label: 'A+' },
    { value: 'A', label: 'A' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B', label: 'B' },
    { value: 'B*', label: 'B-' },
    { value: 'C+', label: 'C+' },
    { value: 'C', label: 'C' },
    { value: 'D+', label: 'D+' },
    { value: 'D', label: 'D' },
    { value: 'F', label: 'F' },
    { value: 'SU', label: 'SU' },
  ];

  //Retrieve data from Firebase
  const getAllModGrade = async () => {
    const docu = await getDoc(userRef);
    setNoSems(docu.data().noOfSems);
    setCurrentSem(docu.data().lastpage);
    setAllMods(docu.data().modgradeinfo);
    setLoaded(true);
  }

  useEffect(() => {
    getAllModGrade();
  }, [])

  //Create semester functionality
  const semPageNumber = [];
  for (let i = 1; i <= noSems; i++) {
    semPageNumber.push(i);
  }

  const convertNumToSem = (n) => {
    return "Y" + (Math.ceil(n / 2)) + "S" + ([2, 1][n % 2])
  }

  const addSem = async () => {
    await updateDoc(userRef, { noOfSems: noSems + 1 });
    window.location.reload(false);
  }

  const remSem = async () => {
    await updateDoc(userRef, { noOfSems: noSems - 1 });
    window.location.reload(false);
  }

  const handleSelectSem = (n) => {
    setCurrentSem(n);
    setClicked(true);
  }

  //Create ModGrade functionality
  const [mods, setMods] = useState([]);

  //Get the mods for the selected semester
  const getMod = () => {
    setMods([]);
    allMods.map((i) => {
      if (i.sem === currentSem) {
        setMods(mods => [...mods, i]);
      }
    })
  }

  const updateLastPage = async () => {
    await updateDoc(userRef, { lastpage: currentSem });
    window.location.reload(false);
  }

  const updateModGradeInfo = async () => {
    await updateDoc(userRef, { modgradeinfo: updatedMods });
    getAllModGrade();
  }

  const applyModGradeInfo = async () => {
    await updateDoc(userRef, { modgradeinfo: tempMods });
    getAllModGrade();
  }

  useEffect(() => {
    if (currentSem !== 0 && clicked) {
      updateLastPage();
    }
  }, [currentSem])

  useEffect(() => {
    getMod();
  }, [allMods])

  useEffect(() => {
    if (changed) {
      setChanged(false);
      updateModGradeInfo();
    }
  }, [updatedMods])

  useEffect(() => {
    setAllMods(tempMods)
  }, [tempMods])

  useEffect(() => {
    if (apply) {
      applyModGradeInfo();
      setApply(false);
    }
  }, [apply])

  const [modCode, setModCode] = useState("");
  const [modGrade, setModGrade] = useState("");

  //Add mod
  const addMod = (e) => {
    e.preventDefault();
    setUpdatedMods([]);
    setUpdatedMods(updatedMods => [...allMods, { sem: currentSem, code: modCode, grade: modGrade }]);
    setChanged(true);
  };

  //Delete mod
  const delMod = (m) => {
    setUpdatedMods([]);
    allMods.map((i) => {
      if (!(i.sem === m.sem &&
        i.code === m.code &&
        i.grade === m.grade)
      ) {
        setUpdatedMods(updatedMods => [...updatedMods, i]);
      }
    })
    setChanged(true);
  }

  //Edit mod code
  const updateModCode = (event, s, c, g, ind) => {
    setTempMods([]);
    allMods.map((i) => {
      if (!(i.sem === s &&
        i.code === c &&
        i.grade === g)) {
          setTempMods(tempMods => [...tempMods, i]);
      } else {
          setTempMods(tempMods => [...tempMods, { sem: s, code: event.target.value, grade: g }])
      }
    })
  }

  //Edit mod grade
  const updateModGrade = (event, s, c, g, ind) => {
    setTempMods([]);
    allMods.map((i) => {
      if (!(i.sem === s &&
        i.code === c &&
        i.grade === g)) {
          setTempMods(tempMods => [...tempMods, i]);
      } else {
          setTempMods(tempMods => [...tempMods, { sem: s, code: c, grade: event.label }])
      }
    })
  }

  const saveModGrade = () => {
    setApply(true)
    window.confirm("Changes Saved");
    // window.location.reload(false);
  }

  const logInfo = () => {
    console.log(allMods);
    console.log(mods)
    console.log(tempMods);
    console.log(apply);
  }

  return (
    <>
    
      {currentSem!==0 
      ? <h6 className="bottom-spacing">Currently Viewing: {convertNumToSem(currentSem)} </h6>
      : <h6 className="bottom-spacing">Currently Viewing: Select a semester! </h6> }
      
      <div className="bottom-spacing">
        <ButtonGroup className="mb-2" >
          <Button onClick={addSem} variant="outline-secondary"> Add Sem</Button>
          <Button onClick={remSem} variant="outline-secondary">Remove Sem</Button>
        </ButtonGroup>
      </div>

      <ButtonGroup className="mb-2">
        {semPageNumber.map((number) =>
          <Button onClick={() => {
            handleSelectSem(number)
          }}
            variant="dark">{convertNumToSem(number)}</Button>
        )}
      </ButtonGroup>

      {
        currentSem !== 0 &&
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Module Code</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            {mods.map((i, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="text"
                        defaultValue={i.code}
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={(event) => updateModCode(event, i.sem, i.code, i.grade, index)}
                      />
                    </InputGroup>
                  </td>
                  <td>
                    <Select type="text" options={gradeOptions} defaultValue={{label: i.grade, value: i.grade}} onChange={(event) => {
                      updateModGrade(event, i.sem, i.code, i.grade, index)
                    }
                    }>
                    </Select>
                  </td>
                  <td><Button onClick={() => delMod(i)} variant="danger"><BsFillTrashFill /></Button></td>
                </tr>
              )
            })}
          </tbody>

        </Table>
      }

      <Button onClick={saveModGrade} variant="outline-secondary">Save Changes</Button>

      {
        currentSem !== 0 &&
        <Form>
          <Row>
            <Col xs="auto">
              <div className="modCode">
                <InputGroup className="mb-2">
                  <InputGroup.Text>Module Code</InputGroup.Text>
                  <Form.Control id="inlineFormInputGroup" onChange={(event) => setModCode(event.target.value)} />
                </InputGroup>
              </div>

              <div className="modGrade">
                <Select options={gradeOptions} placeholder="Select Grade Attained" onChange={(event) => setModGrade(event.label)}></Select>
              </div>

              <div className='addModButton'>
                <Button variant="outline-primary" onClick={addMod}>Add Module</Button>
              </div>
            </Col>
          </Row>
        </Form>
      }


    </>
  )
}