import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NaverLoginCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            fetch("http://localhost:80/login/oauth2/code/naver", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
                credentials: "include", // 쿠키 허용
            })
                .then(response => response.json())
                .then(data => {
                    console.log("백엔드 요청 데이터 : ",data);
                    if (data.accessToken) {
                        localStorage.setItem("accessToken", data.accessToken);
                        localStorage.setItem("refreshToken", data.refreshToken);
                        navigate("/"); // 로그인 성공 후 홈으로 이동
                    } else {
                        console.error("로그인 실패", data);
                        navigate("/login?error=true");
                    }
                })
                .catch(error => {
                    console.error("네트워크 오류", error);
                    navigate("/login?error=true");
                });
        } else {
            navigate("/login?error=true");
        }
    }, [navigate]);

    return <div>로그인 중...</div>;
};

export default NaverLoginCallback;