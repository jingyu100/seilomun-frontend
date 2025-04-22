import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Header from "../../components/Header.jsx";
import MainBanner from "../../components/Main/MainPageBanner.jsx";
import MainLastSP from "../../components/Main/MainLastSP.jsx";
import MainNewMatch from "../../components/Main/MainNewMatch.jsx";
import axios from "axios";
import { useState, useEffect } from "react";

export const List = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "http://localhost:80/api/products/1";

    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        const product = res.data?.Products || res.data?.data?.Products;
        if (product && typeof product === "object") {
          setProduct(product);
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("상품 목록을 가져오는 중 오류 발생:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div>
      <h1>상품 상세</h1>
      <p>상품명: {product.name}</p>
      <p>상품 설명: {product.description}</p>
      <p>가격: {product.discountPrice} 원</p>
      <p>재고 수량: {product.stockQuantity}</p>
      <p>
        만료일:{" "}
        {product.expiryDate
          ? new Date(product.expiryDate).toLocaleDateString()
          : "정보 없음"}
      </p>
      <p>상태: {product.status == 1 ? "판매 중" : "판매 중지"}</p>
      <p>할인율: {product.currentDiscountRate}%</p>
      <p>판매자: {product.seller?.storeName || "판매자 정보 없음"}</p>
    </div>
  );
};

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
