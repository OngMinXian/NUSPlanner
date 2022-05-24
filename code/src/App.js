import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from './pages/Home'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import ForgetPassword from "./pages/ForgetPassword"

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/CreateAccount" element={<CreateAccount />} />
          <Route exact path="/ForgetPassword" element={<ForgetPassword />} />
        </Routes>
    </Router>
  );
}

export default App;
