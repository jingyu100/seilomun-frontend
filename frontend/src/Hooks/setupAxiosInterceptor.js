import axios from "axios";

export function setupAxiosInterceptor({ logoutHandler, navigate, getIsLoggedIn }) {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.warn("세션이 만료되어 자동 로그아웃 처리됩니다.");
        logoutHandler(); // 상태 초기화

        if (getIsLoggedIn()) {
          logoutHandler();
          if (window.location.pathname !== "/login") {
            navigate("/login");
          }
        }
      }
      return Promise.reject(error);
    }
  );
}
