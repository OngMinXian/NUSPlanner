import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, logInWithGoogle } from "../firebase"
import { useAuthState } from 'react-firebase-hooks/auth';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/Home");
  }, [user, loading]);
  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={logInWithGoogle}>
          Login with Google
        </button>
        <div>
          <NavLink to="/ForgetPassword">Forgot Password</NavLink>
        </div>
        <div>
          Don't have an account? <NavLink to="/CreateAccount">Register</NavLink> now.
        </div>
      </div>
    </div>
  );
}

export default Login