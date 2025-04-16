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
import SeRegisterPage from "./pages/SeRegisterPage.jsx";
import NaverLoginCallback from "./pages/NaverLoginCallBack.jsx";
import Customer_modify from "./pages/Customer_modify.jsx";
import useLogin from "./Hooks/useLogin.js";
import { useEffect } from "react";
import axios from "axios";
import { setupAxiosInterceptor } from "./Hooks/setupAxiosInterceptor.js";

function App() {
  const { isLoading, setUser, setIsLoggedIn } = useLogin();

  useEffect(() => {
    setupAxiosInterceptor({
      logoutHandler: () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      },
    });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/api/customers/me", { withCredentials: true })
      .then((res) => {
        const { email, username } = res.data.data;
        setUser({ email, nickname: username });
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify({ email, nickname: username }));
        localStorage.setItem("isLoggedIn", "true");
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      });
  }, []);

  if (isLoading) return null;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/new" element={<NewPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/selogin" element={<SeloginPage />} />
      <Route path="/sail" element={<SailPage />} />
      <Route path="/wish" element={<WishListPage />} />
      <Route path="/Business_numberPage" element={<Business_numberPage />} />
      <Route path="/SeRegister" element={<SeRegisterPage />} />
      <Route path="/oauth-success" element={<NaverLoginCallback />} />
      <Route path="/Customer_modify" element={<Customer_modify />} />
    </Routes>
  );
}

export default App;
