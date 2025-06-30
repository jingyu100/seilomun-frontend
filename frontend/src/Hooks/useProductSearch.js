import { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../api/config";

const useProductSearch = ({
  keyword = "",
  filterType = "ALL",
  sortType = "LATEST",
  page = 0,
  size = 10,
}) => {
  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword.trim()) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/products/search", {
          params: {
            keyword,
            filterType,
            sortType,
            page,
            size,
          },
        });
        setProducts(res.data.content); // Page의 content 배열
        setTotalElements(res.data.totalElements);
        setError(null);
      } catch (err) {
        console.error("❌ 상품 검색 실패:", err);
        setError(err);
        setProducts([]);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, filterType, sortType, page, size]);

  return {
    products,
    totalElements,
    loading,
    error,
  };
};

export default useProductSearch;
