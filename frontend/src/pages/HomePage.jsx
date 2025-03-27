import "../App.css";
import "../css/frame.css";
import Footer from "../components/Footer.jsx";
import SideMenuBtn from "../components/sideBtn/SideMenuBtn.jsx";
import Header from "../components/Header.jsx";
// import axios from "axios";
// import {useState, useEffect} from "react";

// export const List = () => {
//     const [product, setProduct] = useState(null);  // 배열 대신 객체로 상태 선언
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const url = "http://localhost/api/products/list/1/1";
//
//         axios
//             .get(url)
//             .then((res) => {
//                 // 응답이 존재하고 Products가 객체인지 확인
//                 if (res.data.Products && typeof res.data.Products === 'object') {
//                     setProduct(res.data.Products);  // 객체로 상태 업데이트
//                 } else {
//                     setProduct(null);  // Products가 객체가 아니면 null로 설정
//                 }
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 console.error("상품 목록을 가져오는 중 오류 발생:", error);
//                 setLoading(false);
//             });
//     }, []);  // 빈 배열을 넣어주면 컴포넌트가 마운트될 때 한 번만 실행
//
//     if (loading) {
//         return <div>로딩 중...</div>;  // 로딩 중일 때 표시할 UI
//     }
//
//     if (!product) {
//         return <div>상품을 불러오는 데 실패했습니다.</div>;  // 상품이 없을 경우 메시지 출력
//     }
//
//     return (
//         <div>
//             <h1>상품 상세</h1>
//             <p>상품명: {product.name}</p>
//             <p>상품 설명: {product.description}</p>
//             <p>가격: {product.discountPrice} 원</p>
//             <p>재고 수량: {product.stockQuantity}</p>
//             <p>만료일: {new Date(product.expiryDate).toLocaleDateString()}</p>
//             <p>상태: {product.status === "1" ? "판매 중" : "판매 중지"}</p>
//             <p>할인율: {product.currentDiscountRate}%</p>
//             <p>판매자: {product.seller.storeName}</p>
//             {/* 필요에 따라 추가적인 상품 정보 출력 */}
//         </div>
//     );
// };

const HomePage = () => {
  // const [shopList,setShopList]=useState([]);
  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <SideMenuBtn />
        <List />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
