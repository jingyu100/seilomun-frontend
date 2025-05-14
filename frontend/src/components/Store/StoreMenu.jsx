import React, { useState, useEffect } from "react";
import "../../css/customer/Store.css";
import ProductFilter from "../ProductFilter";

export default function StoreMenu() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [keyword, setKeyword] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [sortType, setSortType] = useState("LATEST");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `/api/products/search?keyword=${encodeURIComponent(keyword)}&filterType=${filterType}&sortType=${sortType}&page=${page}&size=${size}`
                );
                if (!response.ok) throw new Error("상품을 불러오는 데 실패했습니다.");
                const data = await response.json();
                setProducts(data.content || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, filterType, sortType, page, size]);

    return (
        <div className="storeMenu" style={{ position: "relative", padding: "30px 0 25px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "40px" }}>
                <ProductFilter setSortType={setSortType} />
            </div>

            <div className="productList">
                {loading && <p>로딩 중...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && products.length === 0 && <p>상품이 없습니다.</p>}

                {products.map((product) => (
                    <div key={product.id} className="productItem" style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "20px"
                    }}>
                        {product.photoUrl && (
                            <img
                                src={product.photoUrl}
                                alt={product.name}
                                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                            />
                        )}
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p><strong>{product.price.toLocaleString()}원</strong></p>
                    </div>
                ))}
            </div>
        </div>
    );
}
