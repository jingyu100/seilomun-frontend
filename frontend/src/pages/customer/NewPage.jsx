import Filter from "../../components/Filter.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import ProductList from "../../components/ProductList.jsx";
import SellerList from "../../components/SellerList.jsx";
import "../../css/customer/New.css";

const NewPage = () => {
    return (
        <div className="New">
            <div className="header">
                <Header/>
            </div>

            <div className="body sideMargin">
                <div className="sail-inner">
                    <Filter/>
                    <div className="main-container">
                        <div className="search-results-container">
                            {/* 판매자 검색 결과 */}
                            <div className="seller-results-section">
                                <SellerList/>
                            </div>

                            {/* 상품 검색 결과 */}
                            <div className="product-results-section">
                                <ProductList/>
                            </div>
                        </div>
                        <SideMenuBtn/>
                    </div>
                </div>
            </div>

            <div className="footer">
                <Footer/>
            </div>
        </div>
    );
};

export default NewPage;