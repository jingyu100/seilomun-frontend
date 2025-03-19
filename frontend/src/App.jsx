import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import New from "./pages/NewPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Selogin from "./pages/SeloginPage.jsx";
import Sail from "./pages/SailPage.jsx";
import WishList from "./pages/WishList.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/"} element={<Home />} />
        <Route path={"/new"} element={<New />} />
        <Route path="/register" element={<Register />} />
        <Route path="/selogin" element={<Selogin />} />
        <Route path="/sail" element={<Sail />} />
        <Route path="/wishlist" element={<WishList />} />
      </Routes>
    </Router>
  );
}

export default App;
