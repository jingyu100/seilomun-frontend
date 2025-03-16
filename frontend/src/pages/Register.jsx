import React, { useState } from "react";
import "../css/Register.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function Register() {
  const [emailDomain, setEmailDomain] = useState("");

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Register;
