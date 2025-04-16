import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../Hooks/useLogin.js";

const NaverLoginCallback = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useLogin();
  useEffect(() => {
    setIsLoggedIn(true);
    navigate("/"); // 로그인 성공 후 홈으로 이동
  }, [navigate, setIsLoggedIn]);

  return <div>로그인 중...</div>;
};

export default NaverLoginCallback;
