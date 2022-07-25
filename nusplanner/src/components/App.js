import React from "react"
import Signup from "./Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; //Switch replaced with Routes
import Today from "./Today";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import DashBoard from "./Dashboard";
import ProgressReport from "./ProgressReport";
import Profile from "./Profile";
import CreateUserDoc from "./CreateUserDoc";
import MonthYear from "./MonthYear";
import Modules from "./Modules";
import EditModCap from "./EditModAndCap";

function App() {
    return (
        <div>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route exact path="/" element={<PrivateRoute />}>
                            <Route exact path="/" element={<Today />} />
                            <Route path="/dashboard" element={<DashBoard />} />
                            <Route path="/month-year" element={<MonthYear />} />
                            <Route path="/progress-report" element={<ProgressReport />} />
                            <Route path="/profile" exact element={<Profile />} />
                            <Route path="/modules" exact element={<Modules />} />
                            <Route path="/editmodcap" exact element={<EditModCap />} />
                        </Route>
                        <Route path="/signup" exact element={<Signup />} />
                        <Route path="/login" exact element={<Login />} />
                        <Route path="/forgot-password" exact element={<ForgotPassword />} />
                        <Route path="/create-user-doc" exact element={<CreateUserDoc />} />
                    </Routes>
                </AuthProvider>

            </Router>
        </div>
    )
}

export default App;