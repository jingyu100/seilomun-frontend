import "../../css/seller/Seller_Main.css";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import Seller_notification from "./Seller_notification.jsx";

const Seller_Main = () => {
    return (
        <div className="Seller-Main">
            <div className="Seller-Header">
                <Seller_Header />
                <Seller_notification />
            </div>
        </div>
    );
  };
  
  export default Seller_Main;