import React, {useRef,useState, useEffect} from 'react'
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

    const [windowDimenion, detectHW] = useState({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
      })
    
      const detectSize = () => {
        detectHW({
          winWidth: window.innerWidth,
          winHeight: window.innerHeight,
        })
      }
    
      useEffect(() => {
        window.addEventListener('resize', detectSize)
    
        return () => {
          window.removeEventListener('resize', detectSize)
        }
      }, [windowDimenion])

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
    <div className="row" >
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

                <input
                    type="password"
                    className="form_input"
                    required="required"
                    ref={passwordRef}
                    placeholder="Password"
                ></input><br></br>

                <input
                    type="password"
                    className="form_input"
                    required="required"
                    ref={passwordConfirmRef}
                    placeholder="Confirmation Password"
                ></input><br></br>

                <button className='button-green' disabled={loading} type="submit">Create Account</button><br></br>
                {error && <Alert variant="danger" className='errorMsg'>{error}</Alert>}
            </form>
            </div>
        </div>

        <div className='column right'>
                    <div className="bg-box">
                    </div>
                    <div className='centered'>
                        <h1>Already have an account?</h1>
                        <Link to="/login"><button className='button-white'> Sign In Now! </button></Link>
                    </div>
                </div>

    </div>
</>
  )
}
