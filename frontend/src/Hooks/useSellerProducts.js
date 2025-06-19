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
        const res = await axios.get(`http://3.36.70.70/api/products/seller/${sellerId}`);

        const transformed = res.data.map(product => {
          // photoUrl 배열의 모든 이미지를 S3 전체 URL로 변환
          const processedPhotoUrls = product.photoUrl && Array.isArray(product.photoUrl)
              ? product.photoUrl.map(url => getThumbnailUrl(url)).filter(url => url !== null)
              : [];

          return {
            ...product,
            photoUrl: processedPhotoUrls, // 변환된 URL 배열로 교체
            thumbnailUrl: processedPhotoUrls[0] || null, // 첫 번째 이미지를 썸네일로 사용
          };
        });

        console.log("변환된 products:", transformed);
        console.log("첫 번째 product의 photoUrl:", transformed[0]?.photoUrl);
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