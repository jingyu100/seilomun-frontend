import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Header from "../../components/Header.jsx";
import MainBanner from "../../components/Main/MainPageBanner.jsx";
import MainLastSP from "../../components/Main/MainLastSP.jsx";
import MainNewMatch from "../../components/Main/MainNewMatch.jsx";
import List from "../../components/List.jsx";
import axios from "axios";
import { useState, useEffect } from "react";

const HomePage = () => {
  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body">
        <MainBanner />
        <div className="sideMargin">
          <SideMenuBtn />
          <List />
        </div>
        <MainLastSP />
        <MainNewMatch />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
