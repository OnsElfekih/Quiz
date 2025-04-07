import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Home from "./components/home"; 
import Login from "./components/login";
import Dashboard from "./components/Dashbord";
function App() {
return (
<Router>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={< Login/>} />
<Route path="/registre" element={<Register />} />
<Route path="/Dashboard" element={<Dashboard />} />
</Routes>
</Router>
);
}
export default App;