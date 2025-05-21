import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.subtitle}>페이지를 찾을 수 없습니다.</p>
      <button style={styles.button} onClick={() => navigate("/")}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "10%",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: "6rem",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
};
