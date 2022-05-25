import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../components/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Icon from "../images/icon.png"

export default function UpdateProfile() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        navigate("/")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
          <h2>Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
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
                <label>Password Confirmation:</label>
                <input 
                  type="text"
                  required="required"
                  ref={passwordConfirmRef}
                  ></input>
            </form>

            <button disabled={loading} type="submit">
              Update
            </button>
          </Form>

      <div>
        <Link to="/">Cancel</Link>
      </div>
    </>
  )
}
