// // import React, { useEffect, useRef, useState } from "react";
// // import axios from "axios";
// import "../../css/customer/Main.css";
// import List from "../../components/List.jsx";

// function MainLastSP() {
//   const products = [
//     {
//       id: 1,
//       name: "발효훈연소시지 1팩 (50g*4개) 2종",
//       price: "3,000원",
//       regularPrice: "5,000원",
//       address: "대구광역시 북구 복현동",
//       discount: "40%",
//       image: "/image/product1.jpg",
//       date: "2024년 11월 13일까지",
//     },
//     {
//       id: 2,
//       name: "발효훈연소시지 1팩 (50g*4개) 2종",
//       price: "3,100원",
//       regularPrice: "5,000원",
//       address: "대구광역시 북구 복현동",
//       discount: "40%",
//       image: "/image/product1.jpg",
//       date: "2024년 11월 13일까지",
//     },
//     {
//       id: 3,
//       name: "발효훈연소시지 1팩 (50g*4개) 2종",
//       price: "3,000원",
//       regularPrice: "5,000원",
//       address: "대구광역시 북구 복현동",
//       discount: "40%",
//       image: "/image/product1.jpg",
//       date: "2024년 11월 13일까지",
//     },
//     {
//       id: 4,
//       name: "발효훈연소시지 1팩 (50g*4개) 2종",
//       price: "3,000원",
//       regularPrice: "5,000원",
//       address: "대구광역시 북구 복현동",
//       discount: "40%",
//       image: "/image/product1.jpg",
//       date: "2024년 11월 13일까지",
//     },
//     {
//       id: 5,
//       name: "발효훈연소시지 1팩 (50g*4개) 2종",
//       price: "3,000원",
//       regularPrice: "5,000원",
//       address: "대구광역시 북구 복현동",
//       discount: "40%",
//       image: "/image/product1.jpg",
//       date: "2024년 11월 13일까지",
//     },
//   ];

//   const [visibleCount, setVisibleCount] = useState(4);
//   // const [products, setProducts] = useState([]);
//   // const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   axios
//   //     .get("http://localhost/api/products/search", {
//   //       params: {
//   //         keyword: "",
//   //         filterType: "RECENT",
//   //         sortType: "LOWEST_PRICE",
//   //         page: 0,
//   //         size: 10,
//   //       },
//   //     })

//   //     .then((res) => {
//   //       console.log("res : ", res);
//   //       setProducts(res.data.content);
//   //       setLoading(false);
//   //     })
//   //     .catch((err) => {
//   //       console.error("상품 검색 실패:", err);
//   //     });
//   // }, []);

//   const ProductCard = ({ product }) => {
//     return (
//       <div className="product_card">
//         <img src={product.imageUrl} alt={product.name} className="product_image" />
//         <div className="product_text">
//           <h3 className="product_name">{product.name}</h3>
//           <div className="product_info">
//             <span className="product_price">{product.price.toLocaleString()}원</span>
//             <div className="product_price_container">
//               <span className="product_regularprice">
//                 {product.regularPrice.toLocaleString()}원
//               </span>
//               <span className="product_discount">{product.discount}</span>
//             </div>
//           </div>
//           <p className="product_address">{product.address}</p>
//           <p className="product_date">{product.expiryDate}</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="homepageUI">
//       <div className="homepageTitle">
//         <span className="homepageTitleUI">
//           <h1>
//             <a href="/sail">임박특가 추천</a>
//           </h1>
//         </span>
//         <span className="homepageTitleUI allWatch">
//           <a href="/sail">
//             전체보기
//             <svg
//               width="16"
//               height="17"
//               viewBox="0 0 16 17"
//               fill="none"
//               className="titleResponsive_arrow"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M5.667 13.5l5-5-5-5"
//               ></path>
//             </svg>
//           </a>
//         </span>
//       </div>

//       <div className="LSP_ProductList">
//         {/* 상품 리스트 */}
//         <div className="LSP_ProductList_Container">
//           {products.slice(0, visibleCount).map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//           {/* {loading ? (
//             <p>불러오는 중...</p>
//           ) : (
//             products
//               .slice(0, visibleCount)
//               .map((product) => <ProductCard key={product.id} product={product} />)
//           )} */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MainLastSP;

import React, { useState } from "react";
import "../../css/customer/Main.css";
``;
function MainLastSP() {
  const products = [
    {
      id: 1,
      name: "발효훈연소시지 1팩 (50g*4개) 2종",
      price: "3,000원",
      regularPrice: "5,000원",
      address: "대구광역시 북구 복현동",
      discount: "40%",
      image: "/image/product1.jpg",
      date: "2024년 11월 13일까지",
    },
    {
      id: 2,
      name: "발효훈연소시지 1팩 (50g*4개) 2종",
      price: "3,100원",
      regularPrice: "5,000원",
      address: "대구광역시 북구 복현동",
      discount: "40%",
      image: "/image/product1.jpg",
      date: "2024년 11월 13일까지",
    },
    {
      id: 3,
      name: "발효훈연소시지 1팩 (50g*4개) 2종",
      price: "3,000원",
      regularPrice: "5,000원",
      address: "대구광역시 북구 복현동",
      discount: "40%",
      image: "/image/product1.jpg",
      date: "2024년 11월 13일까지",
    },
    {
      id: 4,
      name: "발효훈연소시지 1팩 (50g*4개) 2종",
      price: "3,000원",
      regularPrice: "5,000원",
      address: "대구광역시 북구 복현동",
      discount: "40%",
      image: "/image/product1.jpg",
      date: "2024년 11월 13일까지",
    },
    {
      id: 5,
      name: "발효훈연소시지 1팩 (50g*4개) 2종",
      price: "3,000원",
      regularPrice: "5,000원",
      address: "대구광역시 북구 복현동",
      discount: "40%",
      image: "/image/product1.jpg",
      date: "2024년 11월 13일까지",
    },
  ];

  const ProductCard = ({ product }) => {
    return (
      <div className="product_card">
        <img src={product.image} alt={product.name} className="product_image" />
        <div className="product_text">
          <h3 className="product_name">{product.name}</h3>
          <div className="product_info">
            <span className="product_price">{product.price}</span>
            <div className="product_price_container">
              <span className="product_regularprice">{product.regularPrice}</span>
              <span className="product_discount">{product.discount}</span>
            </div>
          </div>
          <p className="product_address">{product.address}</p>
          <p className="product_date">{product.date}</p>
        </div>
      </div>
    );
  };

  const [visibleCount] = useState(4);

  return (
    <div className="homepageUI">
      <div className="homepageTitle">
        <span className="homepageTitleUI">
          <h1>
            <a href="/sail">임박특가 추천</a>
          </h1>
        </span>
        <span className="homepageTitleUI allWatch">
          <a href="/sail">
            전체보기
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              class="titleResponsive_arrow"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.667 13.5l5-5-5-5"
              ></path>
            </svg>
          </a>
        </span>
      </div>

      <div className="LSP_ProductList">
        {/* 상품 리스트 */}
        <div className="LSP_ProductList_Container">
          {products.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainLastSP;
