import React, {useRef,useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Signup() {
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
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError('Failed to create an account')
        }
        setLoading(false)
    }
  return (
    <> 
              <h2> Sign Up </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit = {handleSubmit}>

                  <form>
                      <label>Email:</label>
                      <input 
                        type="text"
                        required="required"
                        ref={emailRef}
                        ></input>
                  </form>

                  <form>
                      <label>Password:</label>
                      <input 
                        type="text"
                        required="required"
                        ref={passwordRef}
                        ></input>
                  </form>

                  <form>
                      <label>Password Confrimation:</label>
                      <input 
                        type="text"
                        required="required"
                        ref={passwordConfirmRef}
                        ></input>
                  </form>

                  <button disabled = {loading} type = "submit">Sign up</button>
              </Form>
      <div > Already have an account? <Link to = "/login"> Log In </Link> 
      </div>
    </>
  )
}
