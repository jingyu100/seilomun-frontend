import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/customer/LoginPage.jsx";
import HomePage from "./pages/customer/HomePage.jsx";
import NewPage from "./pages/customer/NewPage.jsx";
import RegisterPage from "./pages/customer/RegisterPage.jsx";
import MyPage from "./pages/customer_mypage/MyPage.jsx";
import SeloginPage from "./pages/seller/SeloginPage.jsx";
import SailPage from "./pages/customer/SailPage.jsx";
import WishListPage from "./pages/customer/WishListPage.jsx";
import StorePage from "./pages/customer/StorePage.jsx";
import ProductPage from "./pages/customer/ProductPage.jsx";
import Change_dataPage from "./pages/customer_mypage/Change_dataPage.jsx";
import Business_numberPage from "./pages/seller/Business_numberPage.jsx";
import SeRegisterPage from "./pages/seller/SeRegisterPage.jsx";
import { useEffect } from "react";
import NaverLoginCallback from "./pages/customer/NaverLoginCallBack.jsx";
import Customer_modify from "./pages/customer_mypage/Customer_modify.jsx";
import Payment from "./pages/payment/Payment.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx"
import { useNavigate } from "react-router-dom";
import { setupAxiosInterceptor } from "./utils/AxiosInterceptor";
import useLogin from "./Hooks/useLogin";

function App() {
  // const { isLoading } = useLogin();
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetch("http://localhost/api/auth/ping", {
  //       method: "POST",
  //       credentials: "include",
  //     });
  //   }, 60000); // 60초마다
  //   return () => clearInterval(interval); // 안전한 종료 처리
  // }, []); // 최초 1회만 실행

  // if (isLoading) return null;

  const { setIsLoggedIn, setUser } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptor({
      logoutHandler: () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.clear();
      },
      navigate,
    });
  }, [navigate, setIsLoggedIn, setUser]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/new" element={<NewPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/Change_dataPage" element={<Change_dataPage />} />
      <Route path="/selogin" element={<SeloginPage />} />
      <Route path="/sail" element={<SailPage />} />
      <Route path="/wish" element={<WishListPage />} />
      <Route path="/Business_numberPage" element={<Business_numberPage />} />
      <Route path="/SeRegister" element={<SeRegisterPage />} />
      <Route path="/api/sellers/:sellerId" element={<StorePage />} />
      <Route path="/api/products/:id" element={<ProductPage />} />
      <Route path="/oauth-success" element={<NaverLoginCallback />} />
      <Route path="/Customer_modify" element={<Customer_modify />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
