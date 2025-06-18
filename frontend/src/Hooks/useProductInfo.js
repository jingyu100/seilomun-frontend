import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function useProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    const productInfo = async () => {
      try {
        const response = await axios.get(`http://3.36.70.70/api/products/${id}`);
        console.log("🔍 상품 API 전체 응답:", response.data);

        const productDto = response.data.data.Products;
        console.log("🔍 상품 DTO:", productDto);

        if (!productDto) {
          navigate("/404", { replace: true });
          return;
        }

        // 🔥 상품 사진 URL 처리
        const productPhotoUrls = productDto.productPhotoUrl || [];
        console.log("🔍 원본 상품 사진 URLs:", productPhotoUrls);

        // S3 URL 형태로 변환
        const processedPhotoUrls = productPhotoUrls.map(url => {
          if (!url) return null;
          if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
          }
          return `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
        }).filter(url => url !== null);

        console.log("🔍 처리된 상품 사진 URLs:", processedPhotoUrls);

        setProduct({
          productDto: {
            ...productDto,
            processedPhotoUrls // 처리된 URL 배열 추가
          },
          productPhoto: processedPhotoUrls, // 🔥 실제 사진 URL 배열로 설정
          productDocument: null,
        });

        console.log("✅ product 상태 설정 완료");

      } catch (error) {
        console.error("❌ 상품 API 요청 실패:", error);
        console.error("❌ 응답 상태:", error.response?.status);
        console.error("❌ 응답 데이터:", error.response?.data);
        navigate("/404", { replace: true });
      }
    };

    productInfo();
  }, [id, navigate]);

  return { product };
}