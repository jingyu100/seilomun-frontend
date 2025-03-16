import React, { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from '../components/Footer.jsx';
import "../css/Register.css";

function Register() {
    const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  
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
  