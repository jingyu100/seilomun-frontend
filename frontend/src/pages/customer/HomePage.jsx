import useLogin from "../../Hooks/useLogin.js";
import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Header from "../../components/Header.jsx";
import SlideBanner from "../../components/Main/SlideBanner.jsx";
import MainLastSP from "../../components/Main/MainLastSP.jsx";
import MainNewMatch from "../../components/Main/MainNewMatch.jsx";
import MainSuggestProduct from "../../components/Main/MainSuggestProduct.jsx";
import MainSuggestStore from "../../components/Main/MainSuggestStore.jsx";

const HomePage = () => {
  const {isLoggedIn, setIsLoggedIn, user, setUser} = useLogin();
  
  return (
    <div className="homePage">
      <div className="header">
        <Header />
      </div>

      <div className="body">
        <SlideBanner />
        <div className="sideMargin">
          <SideMenuBtn />
        </div>
        {isLoggedIn && (
          <>
            <MainSuggestProduct />
          </>
        )}
        <MainLastSP />
        <MainSuggestStore />
        <MainNewMatch />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
