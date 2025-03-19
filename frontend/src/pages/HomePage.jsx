import "../App.css";
import "../css/frame.css";
import Footer from "../components/Footer.jsx";
import SideMenuBtn from "../components/sideBtn/SideMenuBtn.jsx";
import Header from "../components/Header.jsx";

const Home = () => {
  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <SideMenuBtn />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
