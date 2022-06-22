import { Nav, Navbar } from "react-bootstrap";
import Icon from "../images/icon.png"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

const Sidebar = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch {
      window.confirm("Failed to log out")
    }
  }

  return (
    <div>
      <Navbar bg="light" variant="light" style = {{paddingLeft: "20px"}}>
        <Nav>
          <Navbar.Brand href="/">
            <img
              alt=""
              src={Icon}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            NUSPlanner
          </Navbar.Brand>
          <Nav.Link as={NavLink} to="/">Today</Nav.Link>
          <Nav.Link as={NavLink} to="/month-year">Calendar</Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
          <Nav.Link as={NavLink} to="/progress-report">Progress Report</Nav.Link>
          <Nav.Link as={NavLink} to="/modules">Modules</Nav.Link>
          <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
        </Nav>

        <Nav.Item style = {{marginLeft: "auto", paddingRight: "20px"}}>
          <Link to="/login" onClick={handleLogout} style={{ color: "rgba(0,0,0,.5)" }} ><b>Logout</b></Link>
        </Nav.Item>

      </Navbar>
    </div>
  );
};

export default Sidebar;