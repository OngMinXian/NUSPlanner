import React, { useRef, useState } from 'react'
import { Row, Container, Col, Alert, Button, Image } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Icon from "../images/icon.png"
import "./CSS/forms.css"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

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

                                <input
                                    type="password"
                                    className="form_input"
                                    required="required"
                                    ref={passwordRef}
                                    placeholder="Password"
                                ></input><br></br>

                                <button className='button-green' disabled={loading} type="submit">Sign in</button><br></br>

                                <div className='linkParent'><Link to="/forgot-password" className='link'>Forgot Password?</Link></div>
                                {error && <Alert variant="danger" className='errorMsg'>{error}</Alert>}
                            </form>
                        </div>
                    </Col>

                    <Col sm={3} className="bg" fluid>
                        <div className="centered">
                            <h2 className="whiteText">Haven't created an account?</h2>
                            <br></br>
                            <Link to="/signup"><button className='button-white'> Sign Up Now! </button></Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
