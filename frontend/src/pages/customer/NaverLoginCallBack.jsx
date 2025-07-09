import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../Hooks/useLogin.js";
import api, { API_BASE_URL } from "../../api/config.js";

const NaverLoginCallback = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useLogin();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/api/customers/me");

        const nickname = response.data.data.username;
        const id = response.data.data.id;
        const email = response.data.data.email;
        const userType = response.data.data.userType;

        setUser(nickname, id, email, userType);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify({ setIsLoggedIn }));
        localStorage.setItem("isLoggedIn", "true");

        navigate("/");
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, []);

  return <div>로그인 중입니다...</div>;
};

export default NaverLoginCallback;
