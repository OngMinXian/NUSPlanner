import React, { useRef, useState } from 'react'
import { Row, Container, Col, Alert, Form, Image, Stack, Button, Card } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Icon from "../images/icon.png"
import "./CSS/signup.css"

const Signup = () => {
    const usernameRef = useRef();
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    //For email and PW validation 
    const [validated, setValidated] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        }

        setValidated(true)

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
            <div className="signupBG">
                <Container fluid>
                    <Row>
                        <Col className="col-md-3 mx-auto">
                            <Card className="borderBox">
                                <Card.Body>
                                    <div className="header">
                                        <Image src={Icon} className="logo" />
                                        <h3 className="appName">NUSPlanner</h3>

                                    </div>
                                    {error && <Alert
                                        className="alert"
                                        variant="danger">{error}</Alert>}

                                    <div>
                                        <Stack gap={2}>
                                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder="Name"
                                                        ref={usernameRef}
                                                        className="inputField" />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        required
                                                        type="email"
                                                        placeholder="Email Address"
                                                        ref={emailRef}
                                                        className="inputField" />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        required
                                                        type="password"
                                                        placeholder="Password"
                                                        ref={passwordRef}
                                                        className="inputField" />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        required
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        ref={passwordConfirmRef}
                                                        className="inputField" />
                                                </Form.Group>

                                                <Button style={{ marginBottom: "10px", width: "300px" }}
                                                    variant="outline-dark" disabled={loading}
                                                    type="submit">Sign Up</Button>

                                                <Link to="/login"><Button className="signInButton" variant="outline-primary"> Sign In</Button></Link>
                                            </Form>
                                        </Stack>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container >
            </div >
        </>
    )
}

export default Signup;
