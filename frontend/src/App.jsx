import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home.jsx";
import New from "./pages/New.jsx"
import Login from "./pages/Login.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path={"/login"} element={<Login />} />
                <Route path={"/"} element={<Home />} />
                <Route path={"/new"} element={<New />} />

            </Routes>
        </Router>
    );
}

export default App;
