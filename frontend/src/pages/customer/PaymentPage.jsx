import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Header from "../../components/Header.jsx";
import Payment from "../payment/Payment.jsx";

const PaymentPage = () => {
  return (
    <div className="PaymentPage">
      <div className="header">
        <Header />
      </div>

      <div className="body">
        <div className="sideMargin">
          <Payment />
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default PaymentPage;
