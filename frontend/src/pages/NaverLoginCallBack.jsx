import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../Hooks/useLogin.js";

const NaverLoginCallback = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useLogin();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    if (accessToken && refreshToken) {
      // JWT를 쿠키에 저장
      document.cookie = `Authorization=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict`;
      document.cookie = `RefreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict`;

      setIsLoggedIn(true);
      navigate("/"); // 로그인 성공 후 홈으로 이동
    } else {
      console.error("OAuth 로그인 실패");
      navigate("/login?error=true");
    }
  }, [navigate, setIsLoggedIn]);

  return <div>로그인 중...</div>;
};

export default NaverLoginCallback;
