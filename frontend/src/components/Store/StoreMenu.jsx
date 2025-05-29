import React, { useState, useEffect } from "react";
import useSellerProducts from "../../Hooks/useSellerProducts.js";
import "../../css/customer/Store.css";
import ProductFilter from "./ProductFilter";
import StoreProducts from "./StoreProducts";

export default function StoreMenu() {
    const { products } = useSellerProducts();
    const [sortType, setSortType] = useState("LATEST");

    const productList = products || [];
    

    return (
        <div className="storeMenu" style={{ position: "relative", padding: "30px 0 25px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "40px" }}>
                <ProductFilter setSortType={setSortType} />
            </div>

            <div className="productList">
                {productList.length === 0 ? (
                    <div>등록된 제품이 없습니다.</div>
                ) : (
                    productList.map((prod, index) => (
                        <StoreProducts                          
                          id={prod.id ?? index+1}   // 백의 productDto에 id가 없어서 DB index 사용 (임시)
                          thumbnailUrl={prod.thumbnailUrl || "사진 없음"}
                          name={prod.name}
                          expiryDate={prod.expiryDate}
                          description={prod.description}
                          originalPrice={prod.originalPrice}
                          maxDiscountRate={prod.maxDiscountRate}
                          minDiscountRate={prod.minDiscountRate}
                          discountPrice={prod.discountPrice}
                        />
                      ))
                )}
            </div>
        </div>
    );
}
