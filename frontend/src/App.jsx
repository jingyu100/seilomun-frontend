import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home.jsx";
import New from "./pages/New.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";

function App() {
    return (
        <Router>
            <Routes>
                <Route path={"/login"} element={<Login />} />
                <Route path={"/"} element={<Home />} />
                <Route path={"/new"} element={<New />} />
                <Route path="/register" element={<Register />} />

            </Routes>
        </Router>
    );
}

export default App;
