import { React, useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../components/contexts/AuthContext"
import Icon from "../images/icon.png"

export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    async function handleLogout() {
        setError('')

        try {
            await logout()
            navigate('/login')
        } catch {
            setError('Failed to log out')
        }
    }
    return (
        <>
                    <h2> Profile </h2>
                    {error && <Alert variant="danger"> {error} </Alert>}
                    <strong> Email:</strong> {currentUser.email}
                    <Link to="/update-profile">
                        Update Profile
                    </Link>
            <div>
                <button variant="link" onClick={handleLogout}>Log Out </button>
            </div>
        </>
    )
}
