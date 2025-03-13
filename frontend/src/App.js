import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Home from "./components/home"; 
import Login from "./components/login";
function App() {
return (
<Router>
<Routes>
<Route path="/" element={<Register/>} />
<Route path="/login" element={< Login/>} />
<Route path="/home" element={<Home />} />
</Routes>
</Router>
);
}
export default App;