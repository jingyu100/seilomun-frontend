import axios from "axios";

export function setupAxiosInterceptor({ logoutHandler, navigate }) {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("세션 만료 감지됨: 자동 로그아웃 수행");
        logoutHandler(); // 상태 초기화
        navigate("/login"); // 로그인 페이지로 이동
      }
      return Promise.reject(error);
    }
  );
}
