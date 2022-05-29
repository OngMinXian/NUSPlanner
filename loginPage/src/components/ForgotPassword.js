import React, { useRef, useState, useEffect } from 'react'
import { Row, Container, Col, Alert, Button, Image } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link } from "react-router-dom"
import Icon from "../images/icon.png"
import Background from "../images/background1.jpg"

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
        } catch {
            setError('Failed to reset password')
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
                                    ref={emailRef}
                                    placeholder="Email"
                                ></input><br></br>

                                <button className='button-green' disabled={loading} type="submit">Reset Password</button><br></br>

                                {error && <Alert variant="danger" className='errorMsg'>{error}</Alert>}
                            </form>
                        </div>
                    </Col>

                    <Col sm={3} className="bg" fluid>
                        <div className="centered">
                            <h2 className="whiteText">Remember your password now?</h2>
                            <Link to="/login"><button className='button-white'> Sign In Now! </button></Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>

    )
}

