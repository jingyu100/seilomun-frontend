import axios from "axios";

export function setupAxiosInterceptor({ logoutHandler, navigate, isLoggingIn }) {
  axios.interceptors.response.use(
    (response) => response, // 응답 성공 시 그대로 반환

    (error) => {
      if (error.response?.status === 401 && !isLoggingIn) {
        logoutHandler();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
}
