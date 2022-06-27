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
import Settings from "./Settings";
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
                        <Route exact path="/" element={
                            <PrivateRoute>
                                <Today />
                            </PrivateRoute>} />
                       
                        <Route path="/signup" exact element={<Signup />} />
                        <Route path="/login" exact element={<Login />} />
                        <Route path="/forgot-password" exact element={<ForgotPassword />} />
                        <Route path="/dashboard" exact element={<DashBoard />} />\
                        <Route path="/today" exact element={<Today />} />
                        <Route path="/month-year" exact element={<MonthYear />} />
                        <Route path="/progress-report" exact element={<ProgressReport />} />
                        <Route path="/profile" exact element={<Profile />} />
                        <Route path="/create-user-doc" exact element={<CreateUserDoc />} />
                        <Route path="/settings" exact element={<Settings />} />
                        <Route path="/modules" exact element={<Modules />} />
                        <Route path="/editmodcap" exact element={<EditModCap />} />
                        <Route path="/today" exact element={<Today />} />
                    </Routes>
                </AuthProvider>

            </Router>
        </div>
    )
}

export default App;