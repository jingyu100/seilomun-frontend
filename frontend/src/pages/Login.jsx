import Filter from "../components/Filter.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SideMenuBtn from "../components/sideBtn/SideMenuBtn.jsx";

const Login = () => {
    return (
        <div>
            <div className="header">
                <Header />
            </div>

            <div className="body sideMargin">
                <SideMenuBtn />
            </div>

            <div>
                
            </div>


            <div className="footer">
                <Footer />
            </div>
        </div>
    )
}

export default Login