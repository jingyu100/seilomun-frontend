import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

  const getThumbnailUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http")
      ? url
      : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
  };

export default function useSellerProducts() {
  const { sellerId } = useParams();
  const [products, setProducts] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const fetchProducts = async () => {
      setError(null);
      try {
        const res = await axios.get(`http://localhost/api/products/seller/${sellerId}`);

        const transformed = res.data.map(product => ({
          ...product,
          thumbnailUrl: getThumbnailUrl(product.photoUrl?.[0]), // 👈 여기만 바뀜
        }));
        console.log("thumbnailUrl", transformed);
        setProducts(transformed);
      } catch (error) {
        console.error("제품 정보 요청 실패:", error);
        setError(error);
      }
    };

    fetchProducts();
  }, [sellerId]);

  return { products, error };
}
