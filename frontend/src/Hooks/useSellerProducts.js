import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function useSellerProducts() {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const fetchProducts = async () => {
      setError(null);
      try {
        const response = await axios.get(`http://localhost/api/products/seller/${sellerId}`);
        console.log("판매자 제품 목록 응답:", response.data);

        setProducts(response.data);
      } catch (error) {
        console.error("제품 정보 요청 실패:", error);
        setError(error);
      }
    };

    fetchProducts();
  }, [sellerId]);

  return { products, error };
}
