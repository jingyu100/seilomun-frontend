import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "./Context/LoginContext.jsx";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <LoginProvider>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </LoginProvider>
);
