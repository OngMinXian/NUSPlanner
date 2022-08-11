import React, { useRef, useState } from 'react'
import {
  Row,
  Container,
  Col,
  Alert,
  Button,
  Image,
  Card,
  Stack,
  Form
} from 'react-bootstrap'
import { useAuth } from '../components/contexts/AuthContext'
import { Link } from 'react-router-dom'
import Icon from '../images/icon.png'
import './CSS/forgetPW.css'

export default function ForgotPassword () {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // For email and PW validation
  const [validated, setValidated] = useState(false)

  async function handleSubmit (e) {
    e.preventDefault()

    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }

    setValidated(true)

    try {
      setMessage('')
      setError('')
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
      <div className="forgetPWBG">
        <Container fluid>
          <Row>
            <Col className="col-md-3 mx-auto">
              <Card className="borderBox">
                <Card.Body>
                  <div className="header">
                    <Image src={Icon} className="logo" />
                    <h3 className="appName">NUSPlanner</h3>
                  </div>

                  {error && (
                    <Alert variant="danger" className="alert">
                      {error}
                    </Alert>
                  )}

                  {message && (
                    <Alert variant="success" className="alert">
                      {message}
                    </Alert>
                  )}

                  <Stack gap={2}>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Form.Group className="mb-3">
                        <Form.Control
                          required
                          type="email"
                          placeholder="Email Address"
                          ref={emailRef}
                          className="emailField"
                        />
                        <Form.Control.Feedback>
                          Looks Good!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid email address
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button
                        className="resetPWButton"
                        variant="outline-dark"
                        disabled={loading}
                        type="submit"
                      >
                        Reset Password
                      </Button>

                      <Link to="/login">
                        <Button
                          className="signInButton"
                          variant="outline-primary"
                        >
                          {' '}
                          Sign In
                        </Button>
                      </Link>
                    </Form>
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
