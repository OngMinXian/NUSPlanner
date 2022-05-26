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
    // <> 
    //           <img src={Icon} />
    //           <h1>NUSPlanner</h1>
    //           <h2> Password Reset </h2>
    //           {error && <Alert variant="danger">{error}</Alert>}
    //           {message && <Alert variant="success">{message}</Alert>}
    //           <Form onSubmit = {handleSubmit}>


    //                   <label>Email:</label>
    //                   <input 
    //                     type="text"
    //                     required="required"
    //                     ref={emailRef}
    //                     ></input>


    //               <button disabled = {loading}  type = "submit">Reset Password</button>
    //           </Form>
    //           <div>
    //               <Link to = "/login">Login</Link>
    //           </div>
    //   <img src={Background} />
    //   <div> <h2>Need an account?</h2> <Link to = '/signup'> Sign Up </Link> 
    //   </div>
    // </>

    <>
            <div className="row">
                <div className='column left'>
                    <div className="logo">
                        <img src={Icon} className="icon"></img>
                        <h1 className='iconName'>NUSPlanner</h1>
                    </div>
                    <div className='inputs'>
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
                </div>

                <div className='column right'>
                      <img src={Background} className="background" />  
                      <div className='centered'>
                        <h1>Remember your password now?</h1>
                        <Link to="/login"><button className='button-white'> Sign In Now! </button></Link>
                      </div>     
                </div>
            </div>
        </>
    
  )
}

