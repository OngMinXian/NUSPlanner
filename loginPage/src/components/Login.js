import React, {useRef,useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

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

              <h2> Log In </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <form onSubmit = {handleSubmit}>

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

                  <button disabled = {loading}  type = "submit">Log in</button>
              </form>
              <div>
                  <Link to = "/forgot-password">Forgot Password?</Link>
              </div>
      <div> Need an account? <Link to = '/signup'> Sign Up </Link> 
      </div>
    </>
  )
}

