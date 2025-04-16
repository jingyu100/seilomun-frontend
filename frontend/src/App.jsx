import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/customer/LoginPage.jsx";
import HomePage from "./pages/customer/HomePage.jsx";
import NewPage from "./pages/customer/NewPage.jsx";
import RegisterPage from "./pages/customer/RegisterPage.jsx";
import SeloginPage from "./pages/seller/SeloginPage.jsx";
import SailPage from "./pages/customer/SailPage.jsx";
import WishListPage from "./pages/customer/WishListPage.jsx";
import Business_numberPage from "./pages/seller/Business_numberPage.jsx";
import SeRegisterPage from "./pages/seller/SeRegisterPage.jsx";
import { useEffect } from "react";
import NaverLoginCallback from "./pages/customer/NaverLoginCallBack.jsx";
import Customer_modify from "./pages/customer/Customer_modify.jsx";
import useLogin from "./Hooks/useLogin.js";
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
