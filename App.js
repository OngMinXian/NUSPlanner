import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//import pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import CreateAccount from './pages/CreateAccount';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/SignIn">SignIn</Link>
        <Link to="/CreateAcount">CreateAcount</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
