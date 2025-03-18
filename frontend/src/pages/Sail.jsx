import Filter from "../components/Filter.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SideMenuBtn from "../components/sideBtn/SideMenuBtn.jsx";
import ProductList from "../components/ProductList.jsx";
import "../css/Sail.css";

const Sail = () => {
  return (
    <div className="Sail">
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <div className="inner">
          <Filter />
          <div className="main-container">
            <div className="event-container">
              <div className="event-item">이벤트 내용</div>
            </div>
            <ProductList />
            <SideMenuBtn />
          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Sail;
