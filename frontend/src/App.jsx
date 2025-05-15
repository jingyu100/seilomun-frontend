import {Routes, Route} from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/customer/LoginPage.jsx";
import HomePage from "./pages/customer/HomePage.jsx";
import NewPage from "./pages/customer/NewPage.jsx";
import RegisterPage from "./pages/customer/RegisterPage.jsx";
import MyPage from "./pages/customer/MyPage.jsx"
import SeloginPage from "./pages/seller/SeloginPage.jsx";
import SailPage from "./pages/customer/SailPage.jsx";
import WishListPage from "./pages/customer/WishListPage.jsx";
import StorePage from "./pages/customer/StorePage.jsx";
import Business_numberPage from "./pages/seller/Business_numberPage.jsx";
import SeRegisterPage from "./pages/seller/SeRegisterPage.jsx";
import {useEffect} from "react";
import NaverLoginCallback from "./pages/customer/NaverLoginCallBack.jsx";
import Customer_modify from "./pages/customer/Customer_modify.jsx";
import {useNavigate} from "react-router-dom";
import {setupAxiosInterceptor} from "./utils/AxiosInterceptor";
import useLogin from "./Hooks/useLogin";
// SSE 테스트 페이지 추가
import SSENotificationTestPage from "./pages/test/SSENotificationTestPage.jsx";

function App() {
    const {setIsLoggedIn, setUser} = useLogin();
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
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/new" element={<NewPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/mypage" element={<MyPage/>}/>
            <Route path="/selogin" element={<SeloginPage/>}/>
            <Route path="/sail" element={<SailPage/>}/>
            <Route path="/wish" element={<WishListPage/>}/>
            <Route path="/Business_numberPage" element={<Business_numberPage/>}/>
            <Route path="/SeRegister" element={<SeRegisterPage/>}/>
            <Route path="/Store" element={<StorePage/>}/>
            <Route path="/oauth-success" element={<NaverLoginCallback/>}/>
            <Route path="/Customer_modify" element={<Customer_modify/>}/>
            {/* SSE 테스트 라우트 추가 */}
            <Route path="/test/sse" element={<SSENotificationTestPage/>}/>
        </Routes>
    );
}

export default App;