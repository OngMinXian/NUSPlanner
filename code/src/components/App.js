import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { AuthProvider } from "../contexts/AuthContext"

import Home from './Home'
import SignIn from './SignIn'
import CreateAccount from './CreateAccount'
import ForgetPassword from "./ForgetPassword"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/CreateAccount" element={<CreateAccount />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
