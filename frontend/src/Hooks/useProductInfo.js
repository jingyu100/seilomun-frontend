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
        const response = await axios.get(`http://3.39.239.179/api/products/${id}`);
        console.log("API 응답:", response.data);

        const productDto = response.data.data.Products;
        console.log("🔍 상품 DTO:", productDto);

        if (!productDto) {
          navigate("/404", { replace: true });
          return;
        }

        const productPhotoUrls = productDto.productPhoto.photoUrl || [];

        setProduct({
          productDto,
          productPhoto: productPhotoUrls, // 🔥 실제 사진 URL 배열로 설정
          productDocument: null,
        });

        console.log("✅ product 상태 설정 완료");
        console.log("✅ 설정된 상품 사진:", productPhotoUrls);
      } catch (error) {
        console.error("API 요청 실패:", error);
        // setProduct(null);
        navigate("/404", { replace: true });
      }
    };

    productInfo();
  }, [id, navigate]);

  return { product };
}
