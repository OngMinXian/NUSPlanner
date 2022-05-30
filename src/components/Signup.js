import React, { useRef, useState, useEffect } from 'react'
import { Row, Container, Col, Alert, Button, Image } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Icon from "../images/icon.png"

const Signup = () => {
    const usernameRef = useRef();
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate("/create-user-doc", { state: { usernameProp: usernameRef.current.value, emailProp: emailRef.current.value } });
        } catch {
            setError('Failed to create an account')
        }
        setLoading(false)
    }

    return (
        <>
            <Container fluid className={"no-gutters mx-0 px-0"}>
                <Row noGutters={true}>
                    <Col sm={9}>
                        <div>
                            <Image src={Icon} className="icon" />
                            <h1 className="plannerName">NUSPlanner</h1>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>

                                <input
                                    type="text"
                                    className="form_input"
                                    required="required"
                                    ref={usernameRef}
                                    placeholder="Username"
                                ></input><br></br>

                                <input
                                    type="text"
                                    className="form_input"
                                    required="required"
                                    ref={emailRef}
                                    placeholder="Email"
                                ></input><br></br>

                                <input
                                    type="password"
                                    className="form_input"
                                    required="required"
                                    ref={passwordRef}
                                    placeholder="Password"
                                ></input><br></br>

                                <input
                                    type="password"
                                    className="form_input"
                                    required="required"
                                    ref={passwordConfirmRef}
                                    placeholder="Confirmation Password"
                                ></input><br></br>

                                <button className='button-green' disabled={loading} type="submit">Create Account</button><br></br>
                                {error && <Alert variant="danger" className='errorMsg'>{error}</Alert>}
                            </form>
                        </div>
                    </Col>

                    <Col sm={3} className="bg" fluid>
                        <div className="centered">
                            <h2 className="whiteText">Already have an account?</h2>
                            <Link to="/login"><button className='button-white'> Sign In Now! </button></Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Signup;
