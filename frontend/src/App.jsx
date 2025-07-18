import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupAxiosInterceptor } from "./utils/AxiosInterceptor";
import { ChatRoomsProvider } from "../src/Context/ChatRoomsContext.jsx";
import { WebSocketProvider } from "../src/Context/WebSocketContext.jsx";
import { CartProvider } from "../src/Context/CartContext";
import { NotificationProvider } from "../src/Context/NotificationContext";

import useLogin from "./Hooks/useLogin";
import "./App.css";

/* 소비자 */
import LoginPage from "./pages/customer/LoginPage.jsx";
import HomePage from "./pages/customer/HomePage.jsx";
import NewPage from "./pages/customer/NewPage.jsx";
import RegisterPage from "./pages/customer/RegisterPage.jsx";
import SailPage from "./pages/customer/SailPage.jsx";
import WishListPage from "./pages/customer/WishListPage.jsx";
import StoreListPage from "./pages/customer/StoreListPage.jsx";
import StorePage from "./pages/customer/StorePage.jsx";
import ProductPage from "./pages/customer/ProductPage.jsx";
import PaymentPage from "./pages/customer/PaymentPage.jsx";
import NaverLoginCallback from "./pages/customer/NaverLoginCallBack.jsx";
import OrderListPage from "./pages/customer/OrderListPage.jsx";
import PostcodePopup from "./components/PostcodePopup";
import OrderDetailPage from "./pages/customer/OrderDetailPage.jsx";

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
import Seller_newstoreRegistration from "./pages/seller/Seller_newstoreRegistration.jsx";
import Seller_reviewPage from "./pages/seller/Seller_reviewPage.jsx";
import Seller_ProductManagement from "./pages/seller/Seller_ProductManagement.jsx";
import Seller_ProductRegister from "./pages/seller/Seller_ProductRegister.jsx";
import Seller_Stats from "./pages/seller/Seller_Stats.jsx";
import Seller_OrderDetail from "./pages/seller/Seller_OrderDetail.jsx";
import Seller_RefundDetail from "./pages/seller/Seller_RefundDetail.jsx";
import Seller_ProductUpdate from "./pages/seller/Seller_ProductUpdate.jsx";

function App() {
  // const { isLoading } = useLogin();
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetch("http://3.36.70.70/api/auth/ping", {
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
    <NotificationProvider>
      <CartProvider>
        <ChatRoomsProvider>
          <WebSocketProvider>
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
              <Route path="/sellers" element={<StoreListPage />} />
              <Route path="/sellers/:sellerId" element={<StorePage />} />
              <Route path="/postcode-popup" element={<PostcodePopup />} />
              <Route
                path="/sellers/:sellerId/products/:productId"
                element={<ProductPage />}
              />
              <Route path="/oauth-success" element={<NaverLoginCallback />} />
              <Route path="/Customer_modify" element={<Customer_modify />} />
              <Route path="/Customer_point" element={<Customer_point />} />
              <Route path="/Customer_refund" element={<Customer_refund />} />
              <Route path="/Customer_review" element={<Customer_review />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/OrderList" element={<OrderListPage />} />
              {/* ✅ 기존 라우트와 새로운 파라미터 라우트 모두 유지 */}
              <Route path="/OrderDetail" element={<OrderDetailPage />} />
              <Route path="/OrderDetail/:orderId" element={<OrderDetailPage />} />
              <Route path="/Seller_Main" element={<Seller_Main />} />
              <Route
                path="/Seller_newstoreRegistration"
                element={<Seller_newstoreRegistration />}
              />
              <Route path="/Seller_reviewPage" element={<Seller_reviewPage />} />
              <Route
                path="/seller/product/management"
                element={<Seller_ProductManagement />}
              />
              <Route
                path="/seller/product/register"
                element={<Seller_ProductRegister />}
              />
              <Route
                path="/seller/product/update/:productId"
                element={<Seller_ProductUpdate />}
              />
              <Route path="/seller/stats" element={<Seller_Stats />} />

              {/* 판매자 주문 관리 */}
              <Route
                path="/seller/orders/number/:orderNumber"
                element={<Seller_OrderDetail />}
              />
              <Route path="/seller/orders/:orderId" element={<Seller_OrderDetail />} />
              <Route path="/seller/refunds/:refundId" element={<Seller_RefundDetail />} />
            </Routes>
          </WebSocketProvider>
        </ChatRoomsProvider>
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;
