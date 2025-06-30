// API 기본 설정
export const API_BASE_URL = "http://3.39.239.179"; // 여기서만 주소 변경하면 됨!

// axios 인스턴스 생성
import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 포함
  timeout: 10000,
});

export default api;
