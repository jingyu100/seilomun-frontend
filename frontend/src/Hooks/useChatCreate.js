import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api, { API_BASE_URL } from "../api/config.js";

export default function useChatCreate() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    const productInfo = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        console.log("API 응답:", response.data);

        const productDto = response.data.data.Products;

        if (!productDto) return;

        setProduct({
          productDto,
          productPhoto: null,
          productDocument: null,
        });
      } catch (error) {
        console.error("API 요청 실패:", error);
        setProduct(null);
      }
    };

    productInfo();
  }, [id]);

  return { product };
}
