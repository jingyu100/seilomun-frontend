import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupAxiosInterceptor } from "./utils/AxiosInterceptor";
import { ChatRoomsProvider } from "../src/Context/ChatRoomsContext.jsx";
import useLogin from "./Hooks/useLogin";
import "./App.css";

/* 소비자 */
import LoginPage from "./pages/customer/LoginPage.jsx";
import HomePage from "./pages/customer/HomePage.jsx";
import NewPage from "./pages/customer/NewPage.jsx";
import RegisterPage from "./pages/customer/RegisterPage.jsx";
import SailPage from "./pages/customer/SailPage.jsx";
import WishListPage from "./pages/customer/WishListPage.jsx";
import StorePage from "./pages/customer/StorePage.jsx";
import ProductPage from "./pages/customer/ProductPage.jsx";
import PaymentPage from "./pages/customer/PaymentPage.jsx";
import NaverLoginCallback from "./pages/customer/NaverLoginCallBack.jsx";
import OrderListPage from "./pages/customer/OrderListPage.jsx";
import PostcodePopup from "./components/PostcodePopup";

/* 소비자 마이페이지 */
import MyPage from "./pages/customer_mypage/MyPage.jsx";
import Change_dataPage from "./pages/customer_mypage/Change_dataPage.jsx";
import Customer_modify from "./pages/customer_mypage/Customer_modify.jsx";
import Delivery_destination from "./pages/customer_mypage/Delivery_destination.jsx";
import Customer_point from "./pages/customer_mypage/Customer_point.jsx";
import Customer_refund from "./pages/customer_mypage/Customer_refund.jsx";
import Customer_review from "./pages/customer_mypage/Customer_review.jsx";

/* 판매자 */
import Seller_Main from "./pages/seller/Seller_Main.jsx";
import Business_numberPage from "./pages/seller/Business_numberPage.jsx";
import SeRegisterPage from "./pages/seller/SeRegisterPage.jsx";
import SeloginPage from "./pages/seller/SeloginPage.jsx";

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
    <ChatRoomsProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/new" element={<NewPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/Delivery_destination" element={<Delivery_destination />} />
        <Route path="/Change_dataPage" element={<Change_dataPage />} />
        <Route path="/selogin" element={<SeloginPage />} />
        <Route path="/sail" element={<SailPage />} />
        <Route path="/wish" element={<WishListPage />} />
        <Route path="/Business_numberPage" element={<Business_numberPage />} />
        <Route path="/SeRegister" element={<SeRegisterPage />} />
        <Route path="/sellers/:sellerId" element={<StorePage />} />
        <Route path="/postcode-popup" element={<PostcodePopup />} />
        <Route path="/sellers/:sellerId/products/:productId" element={<ProductPage />} />
        <Route path="/oauth-success" element={<NaverLoginCallback />} />
        <Route path="/Customer_modify" element={<Customer_modify />} />
        <Route path="/Customer_point" element={<Customer_point />} />
        <Route path="/Customer_refund" element={<Customer_refund />} />
        <Route path="/Customer_review" element={<Customer_review />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/OrderList" element={<OrderListPage />} />
        <Route path="/Seller_Main" element={<Seller_Main />} />
      </Routes>
    </ChatRoomsProvider>
  );
}

export default App;
