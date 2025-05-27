import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost", // 백엔드가 80포트에서 도는 경우
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
