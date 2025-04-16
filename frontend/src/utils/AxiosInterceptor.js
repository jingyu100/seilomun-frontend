import axios from "axios";

export function setupAxiosInterceptor({ logoutHandler, navigate, getIsLoggingIn }) {
  axios.interceptors.response.use(
    (response) => response, // 응답 성공 시 그대로 반환

    (error) => {
      if (error.response?.status === 401 && !getIsLoggingIn()) {
        logoutHandler();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
}
