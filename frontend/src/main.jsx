import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "./Context/LoginContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoginProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LoginProvider>
  </StrictMode>
);
