import {  Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/contexts/AuthContext"

export default function PrivateRoute() {
    const { currentUser } = useAuth();
  
    return currentUser ? <Outlet/> : <Navigate to="/login" />;
  }