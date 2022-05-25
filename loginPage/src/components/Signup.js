import React, {useRef,useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Icon from "../images/icon.png"
import Background from "../images/background1.jpg"

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
              <img src={Icon} />
              <h1>NUSPlanner</h1>
              <h2> Sign Up </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit = {handleSubmit}>

                      <label>Email:</label>
                      <input 
                        type="text"
                        required="required"
                        ref={emailRef}
                        ></input>


                      <label>Password:</label>
                      <input 
                        type="text"
                        required="required"
                        ref={passwordRef}
                        ></input>



                      <label>Password Confirmation:</label>
                      <input 
                        type="text"
                        required="required"
                        ref={passwordConfirmRef}
                        ></input>


                  <button disabled = {loading} type = "submit">Sign up</button>
              </Form>
      <img src={Background} />
      <div > <h2>Already have an account?</h2> <Link to = "/login"> Log In </Link> 
      </div>
    </>
  )
}
