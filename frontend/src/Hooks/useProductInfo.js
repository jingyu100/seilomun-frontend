import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function useProductInfo() {
   const { id } = useParams();
   const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    const productInfo = async () => {
      try {
        const response = await axios.get(`http://localhost/api/products/${id}`);
        console.log("API 응답:", response.data);

        const productDto = response.data.data.Products;

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