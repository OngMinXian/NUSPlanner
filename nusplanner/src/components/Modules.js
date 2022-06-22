import React, { useState, useEffect } from 'react'
import Pagination from './Pagination.js';
import { Container, Col, Row, InputGroup, Form, Card } from 'react-bootstrap';
import Sidebar from "./Sidebar"


function Modules() {

    const [modules, setModules] = useState([]);
    const [code, setCode] = useState("");
    const [matchedMods, setMatchedMods] = useState([]);
    const [emptied, setEmptied] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(7);

    //Debounced term to make code more efficient 
    const [debouncedTerm, setDebouncedTerm] = useState(code)

    //Hooks for filters below
    //Hooks for exam filter 
    const [hasExam, setHasExam] = useState(false)
    //Hooks for su options 
    const [hasSU, setHasSU] = useState(false)

    //Hooks for sem 1 availability 
    const [hasSem1, setHasSem1] = useState(false)
    //Hooks for sem 2 availability 
    const [hasSem2, setHasSem2] = useState(false)
    //Hooks for sem 3 (aka ST1) availability
    const [hasSem3, setHasSem3] = useState(false)
    //Hooks for sem 4 (aka ST2 availability)
    const [hasSem4, setHasSem4] = useState(false)

    //Hooks for 0-3MCs
    const [hasZeroToThree, setHasZeroToThree] = useState(false)
    //Hooks for 4 MCs
    const [hasFour, setHasFour] = useState(false)
    //Hooks for 5-8MCs
    const [hasFiveToEight, setHasFiveToEight] = useState(false)
    //Hooks for >8 MCs
    const [hasMoreThanEight, setHasMoreThanEight] = useState(false)

    const fetchModules = () => {
        fetch('https://api.nusmods.com/v2/2022-2023/moduleInfo.json')
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(false);
                setModules(data);
                setMatchedMods(data);
            })
            .catch((error) => {
                setIsLoading(false);
                setIsError(true);
                console.log(error);
            });
    }

    //Functions to filter based on criteria and search results are below 

    //Search result filter
    const getMod = () => {
        let result = modules
        result = allFilters(result)
        if (code.length === 0) {
            setMatchedMods(result)
        } else {
            result = result.filter(mod => {
                if (mod.moduleCode.slice(0, code.length) === code.toUpperCase() /*|| mod.title.toUpperCase().includes(code.toUpperCase())*/) {
                    return true
                } else {
                    return false
                }
            })
            setMatchedMods(result)
        }
    }

    //Criteria filters 

    //Filter for examinable mods 
    const getExamMod = (array) => {
        if (hasExam) {
            return array.filter(indivMod => indivMod.semesterData.filter(semDetails => "examDate" in semDetails).length > 0)
        } else {
            return array
        }
    }

    //Filter for SU-able mods
    const getSU = (array) => {
        if (hasSU) {
            return array.filter(indivMod => {
                if ("attributes" in indivMod && indivMod.attributes.su === true) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return array
        }
    }

    //Filter for mods offered in S1, S2, ST1, OR ST2

    const getHasSem1 = (array) => {
        if (hasSem1) {
            return array.filter(indivMod => indivMod.semesterData.filter(semDetails => {
                if ("semester" in semDetails && semDetails.semester === 1) {
                    return true
                } else {
                    return false
                }
            }).length > 0)
        } else {
            return array
        }
    }

    const getHasSem2 = (array) => {
        if (hasSem2) {
            return array.filter(indivMod => indivMod.semesterData.filter(semDetails => {
                if ("semester" in semDetails && semDetails.semester === 2) {
                    return true
                } else {
                    return false
                }
            }).length > 0)
        } else {
            return array
        }
    }

    const getHasSem3 = (array) => {
        if (hasSem3) {
            return array.filter(indivMod => indivMod.semesterData.filter(semDetails => {
                if ("semester" in semDetails && semDetails.semester === 3) {
                    return true
                } else {
                    return false
                }
            }).length > 0)
        } else {
            return array
        }
    }

    const getHasSem4 = (array) => {
        if (hasSem4) {
            return array.filter(indivMod => indivMod.semesterData.filter(semDetails => {
                if ("semester" in semDetails && semDetails.semester === 4) {
                    return true
                } else {
                    return false
                }
            }).length > 0)
        } else {
            return array
        }
    }

    //Filter for mods by MCs
    const zeroToThree = (array) => {
        if (hasZeroToThree) {
            return array.filter(indivMod => {
                let modVal = parseInt(indivMod.moduleCredit)
                if (modVal >= 0 && modVal <= 3) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return array
        }
    }

    const four = (array) => {
        if (hasFour) {
            return array.filter(indivMod => {
                let modVal = parseInt(indivMod.moduleCredit)
                if (modVal === 4) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return array
        }
    }

    const fiveToEight = (array) => {
        if (hasFiveToEight) {
            return array.filter(indivMod => {
                let modVal = parseInt(indivMod.moduleCredit)
                if (modVal >= 5 && modVal <= 8) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return array
        }
    }

    const moreThanEight = (array) => {
        if (hasMoreThanEight) {
            return array.filter(indivMod => {
                let modVal = parseInt(indivMod.moduleCredit)
                if (modVal > 8) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return array
        }
    }

    //Function containing all filters that the search results will pass through 

    //Filter to check if multiple sems (same category) are being selected 
    const multipleSemsSelected = () => {
        let check = [hasSem1, hasSem2, hasSem3, hasSem4]
        if (check.filter(sem => sem === true).length > 1) {
            return true
        } else {
            return false
        }
    }

    //Function to handle filtering if multiple sems are being selected 
    const handleMultipleSemFilter = (currVal) => {
        let check = [hasSem1, hasSem2, hasSem3, hasSem4]
        let allFilters = [getHasSem1, getHasSem2, getHasSem3, getHasSem4]
        let finalOutput = []
        for (let i = 0; i < check.length; i++) {
            if (check[i] === true) {
                let currentFilter = allFilters[i]
                finalOutput = finalOutput.concat(currentFilter(currVal))
            }
        }
        finalOutput = [...new Set(finalOutput)]
        return finalOutput
    }

    //Filter to check if multiple MCs (same category) are being selected 
    const multipleMcSelected = () => {
        let check = [hasZeroToThree, hasFour, hasFiveToEight, hasMoreThanEight]
        if (check.filter(mc => mc === true).length > 1) {
            return true
        } else {
            return false
        }
    }

    //Function to handle filtering if multiple MCs are being selected 
    const handleMultipleMcFilter = (currVal) => {
        let check = [hasZeroToThree, hasFour, hasFiveToEight, hasMoreThanEight]
        let allFilters = [zeroToThree, four, fiveToEight, moreThanEight]
        let finalOutput = []
        for (let i = 0; i < check.length; i++) {
            if (check[i] === true) {
                let currentFilter = allFilters[i]
                finalOutput = finalOutput.concat(currentFilter(currVal))
            }
        }
        finalOutput = [...new Set(finalOutput)]
        return finalOutput
    }

    const allFilters = (val) => {
        val = getExamMod(val)
        val = getSU(val)
        if (!multipleSemsSelected() && !multipleMcSelected()) {
            val = getHasSem1(val)
            val = getHasSem2(val)
            val = getHasSem3(val)
            val = getHasSem4(val)
            val = zeroToThree(val)
            val = four(val)
            val = fiveToEight(val)
            val = moreThanEight(val)
        } else if (multipleSemsSelected() && !multipleMcSelected()) {
            val = handleMultipleSemFilter(val)
            val = zeroToThree(val)
            val = four(val)
            val = fiveToEight(val)
            val = moreThanEight(val)
        } else if (!multipleSemsSelected() && multipleMcSelected()) {
            val = handleMultipleMcFilter(val)
            val = getHasSem1(val)
            val = getHasSem2(val)
            val = getHasSem3(val)
            val = getHasSem4(val)
        }
        return val
    }


    //Use Effect to trigger state changes below
    useEffect(() => {
        const timer = setTimeout(() => setCode(debouncedTerm), 100)
        return () => clearTimeout(timer)
    }, [debouncedTerm])

    useEffect(() => {
        return () => {
            fetchModules();
        }
    }, []);

    useEffect(() => {
        setMatchedMods([])
        setEmptied(!emptied);
        setCurrentPage(1);
    }, [code]);

    useEffect(() => {
        getMod();
    }, [emptied, hasExam, hasSU, hasSem1, hasSem2, hasSem3, hasSem4, hasZeroToThree, hasFour, hasFiveToEight, hasMoreThanEight]);


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentMods = matchedMods.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <> 
        <Sidebar></Sidebar>
            <Container>
                <Row style={{ marginTop: "50px" }}>
                    <Col sm={9}>
                        <InputGroup className="mb-3" >
                            <InputGroup.Text id="basic-addon1">Module Search</InputGroup.Text>
                            <Form.Control
                                placeholder="Module Code Here"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={(event) => setDebouncedTerm(event.target.value)}
                            />
                        </InputGroup>

                        {
                            currentMods.map((m, index) => {
                                return (
                                    <>
                                        <div key={index}>
                                            <Card>
                                                <Card.Body>
                                                    <p><h3>{m.moduleCode}</h3></p>
                                                    <p><h5>{m.title}</h5></p>
                                                    <p>{m.description}</p>
                                                    <b><a href={'https://nusmods.com/modules/' + m.moduleCode} target="_blank">Link to NUSMODS page</a></b>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                        <br></br>
                                    </>
                                )
                            })
                        }
                    </Col>

                    <Col sm={3}>
                        <Card>
                            <Card.Body>
                                <div>
                                    <h6> Semester Offered </h6>
                                    <Form.Check
                                        type='checkbox'
                                        label='Semester 1'
                                        onClick={
                                            () => {
                                                setHasSem1(!hasSem1)
                                            }
                                        }
                                    />
                                    <Form.Check
                                        type='checkbox'
                                        label="Semester 2"
                                        onClick={
                                            () => {
                                                setHasSem2(!hasSem2)
                                            }
                                        }
                                    />
                                    <Form.Check
                                        type='checkbox'
                                        label="Special Term 1"
                                        onClick={
                                            () => {
                                                setHasSem3(!hasSem3)
                                            }
                                        }
                                    />
                                    <Form.Check
                                        type='checkbox'
                                        label="Special Term 2"
                                        onClick={
                                            () => {
                                                setHasSem4(!hasSem4)
                                            }
                                        }
                                    />
                                </div>

                                <div style={{ marginTop: "10px" }}>
                                    <h6>Exam</h6>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Has Exam"
                                        onClick={
                                            () => {
                                                setHasExam(!hasExam)
                                            }
                                        }
                                    />
                                </div>

                                <div style={{ marginTop: "10px" }}>
                                    <h6>Number of MCs</h6>
                                    <Form.Check
                                        type='checkbox'
                                        label="0 - 3 MC"
                                        onClick={
                                            () => {
                                                setHasZeroToThree(!hasZeroToThree)
                                            }
                                        }
                                    />

                                    <Form.Check
                                        type='checkbox'
                                        label="4 MC"
                                        onClick={
                                            () => {
                                                setHasFour(!hasFour)
                                            }
                                        }
                                    />

                                    <Form.Check
                                        type='checkbox'
                                        label="5 - 8 MC"
                                        onClick={
                                            () => {
                                                setHasFiveToEight(!hasFiveToEight)
                                            }
                                        }
                                    />

                                    <Form.Check
                                        type='checkbox'
                                        label="More than 8 MC"
                                        onClick={
                                            () => {
                                                setHasMoreThanEight(!hasMoreThanEight)
                                            }
                                        }
                                    />
                                </div>

                                <div style={{ marginTop: "10px" }}>
                                    <h6>S/U Options</h6>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Has SU options"
                                        onClick={
                                            () => {
                                                setHasSU(!hasSU)
                                            }
                                        }
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Col sm={8} className="mx-auto">
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={matchedMods.length}
                        paginate={paginate}
                        pageNumber={currentPage}
                    />
                </Col>
            </Container>
        </>
    )
}

export default Modules