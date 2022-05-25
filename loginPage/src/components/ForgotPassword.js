import React, {useRef,useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
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
              <img src={Icon} />
              <h1>NUSPlanner</h1>
              <h2> Password Reset </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit = {handleSubmit}>

                  <form>
                      <label>Email:</label>
                      <input 
                        type="text"
                        required="required"
                        ref={emailRef}
                        ></input>
                  </form>

                  <button disabled = {loading}  type = "submit">Reset Password</button>
              </Form>
              <div>
                  <Link to = "/login">Login</Link>
              </div>
      <img src={Background} />
      <div> <h2>Need an account?</h2> <Link to = '/signup'> Sign Up </Link> 
      </div>
    </>
  )
}

