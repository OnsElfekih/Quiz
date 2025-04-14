import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Home from "./components/home";
import Login from "./components/login";
import Dashboard from "./components/Dashbord";
import { UserProvider } from './components/UserContext';
import ParticipateQuiz from './components/ParticipateQuiz';



function App() {
  return (
    // UserProvider makes the user context available throughout the app
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registre" element={<Register />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/participate/:id" element={<ParticipateQuiz />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
