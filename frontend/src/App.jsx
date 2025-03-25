import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NewPage from "./pages/NewPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SeloginPage from "./pages/SeloginPage.jsx";
import SailPage from "./pages/SailPage.jsx";
import WishListPage from "./pages/WishListPage.jsx";
import Business_numberPage from "./pages/Business_numberPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/new" element={<NewPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/selogin" element={<SeloginPage />} />
        <Route path="/sail" element={<SailPage />} />
        <Route path="/wish" element={<WishListPage />} />
        <Route path="/Business_numberPage" element={<Business_numberPage />} />
      </Routes>
    </Router>
  );
}

export default App;
