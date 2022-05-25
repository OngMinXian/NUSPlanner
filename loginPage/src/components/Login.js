import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Icon from "../images/icon.png"
import Background from "../images/background1.jpg"
import "./CSS/style.css"
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
            <div className ="container-1">
                <div>
                    <img src={Icon} height="247" width="170" className="icon"/>
                    <h1>NUSPlanner</h1>
                    <h2> Log In </h2>
                    {error && <Alert variant="danger">{error}</Alert>}
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
                        ></input>

                        <button className='button-green' disabled={loading} type="submit">Log in</button>
                    </form>
                    <div>
                        <Link to="/forgot-password" className='link'>Forgot Password?</Link>
                    </div>
                </div>
                <div className = "logo">
                    <img src={Background} height = "1023" width = "509" />
                    <div>
                        <h2>Haven't created an account yet?</h2>
                        <button className='button-white' to = '/signup'> Sign Up Now! </button> 
                    </div>
                </div>
            </div>
        </>
    )
}

