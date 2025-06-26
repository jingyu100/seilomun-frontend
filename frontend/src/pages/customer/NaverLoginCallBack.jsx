import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../Hooks/useLogin.js";
import axios from "axios";

const NaverLoginCallback = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useLogin();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://3.39.239.179/api/customers/me", {
          withCredentials: true,
        });

        const nickname = response.data.data.username;

        setUser({ nickname });
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify({ nickname }));
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
