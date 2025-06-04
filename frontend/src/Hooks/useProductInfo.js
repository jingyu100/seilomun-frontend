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
        const response = await axios.get(`http://localhost/api/products/${id}`);
        console.log("API 응답:", response.data);

        const productDto = response.data.data.Products;

        if (!productDto) {
          navigate("/404", { replace: true });
          return;
        }

        setProduct({
          productDto,
          productPhoto: null,
          productDocument: null,
        });
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
