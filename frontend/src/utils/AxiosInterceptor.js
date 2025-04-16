import axios from "axios";

export function setupAxiosInterceptor({ logoutHandler, navigate }) {
  axios.interceptors.response.use(
    (response) => response, // 응답 성공 시 그대로 반환

    (err) => {
      if (err.response && err.response.status === 401) {
        logoutHandler();
        navigate("/login");
      }
      return Promise.reject(err);
    }
  );
}
