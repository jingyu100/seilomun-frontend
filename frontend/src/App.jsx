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
// import { useEffect } from "react";
import NaverLoginCallback from "./pages/NaverLoginCallBack.jsx";
import useLogin from "./Hooks/useLogin.js";

function App() {
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetch("http://localhost/api/auth/ping", {
  //       method: "POST",
  //       credentials: "include",
  //     });
  //   }, 60000); // 60초마다

  //   return () => clearInterval(interval); // 안전한 종료 처리
  // }, []); // 최초 1회만 실행

  const { isLoading } = useLogin();
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
    </Routes>
  );
}

export default App;
