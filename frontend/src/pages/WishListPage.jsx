import "../App.css";
import "../css/frame.css";
import Footer from "../components/Footer.jsx";
import SideMenuBtn from "../components/sideBtn/SideMenuBtn.jsx";
import Header from "../components/Header.jsx";
import { useEffect } from "react";
import WishListEmpty from "../components/WishListEmpty.jsx";
import WishListFilled from "../components/WishListFilled.jsx";

const WishListPage = () => {
  useEffect(() => {}, []);

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <SideMenuBtn />
        {wishlist.length === 0 ? <WishListEmpty /> : <WishListFilled />}
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default WishListPage;
