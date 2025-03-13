import Filter from "../components/Filter.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SideMenuBtn from "../components/sideBtn/SideMenuBtn.jsx";
import ProductList from "../components/ProductList.jsx";
import "../css/New.css"


const New = () => {
    return(<div className="New">
        <div className="header">
            <Header />
        </div>

        <div className="body sideMargin">
            <div className= "main-container">
                <Filter/>
                <ProductList />
                <SideMenuBtn />
            </div>
        </div>


        <div className="footer">
            <Footer />
        </div>

    </div>)
}

export default New