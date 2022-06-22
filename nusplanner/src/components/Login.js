import React, { useRef, useState } from 'react'
import { Row, Container, Col, Alert, Form, Image, Stack, Button, Card } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Icon from "../images/icon.png"
import "./CSS/login.css"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
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

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError('Failed to log in')
        }
        setLoading(false)
    }
    return (
        <>
            <div className="loginBG">
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
                                                        type="email"
                                                        placeholder="Email Address"
                                                        ref={emailRef}
                                                        className="emailField" />
                                                    <Form.Control.Feedback>Looks Good!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">Please provide a valid email address</Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        required
                                                        type="password"
                                                        placeholder="Password"
                                                        ref={passwordRef}
                                                        className="pwField" />
                                                    <Form.Control.Feedback>Looks Good!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">Please provide a valid password</Form.Control.Feedback>
                                                </Form.Group>

                                                <Button style={{ marginBottom: "10px", width: "300px" }}
                                                    variant="outline-dark" disabled={loading}
                                                    type="submit">Sign In</Button>

                                                <Link to="/signup"><Button className="signupButton" variant="outline-primary"> Sign Up</Button></Link>
                                            </Form>
                                        </Stack>

                                        <div className='forgetPW'><Link to="/forgot-password" className='link'><h6>Forgot Password?</h6></Link></div>
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
