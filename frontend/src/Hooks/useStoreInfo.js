import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function useStoreInfo() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const storeInfo = async () => {
      try {
        const response = await axios.get(`http://localhost/api/sellers/${sellerId}`);
        console.log("API 응답:", response.data);

        const sellerInformationDto = response.data.data.seller;

        if (!sellerInformationDto) {
          navigate("/404", { replace: true });
          return;
        }

        setStore({
          sellerInformationDto,
          sellerPhotoDto: null,
          sellerRegisterDto: null, // 필요한 경우 백에서 받아서 넣기
        });
      } catch (error) {
        console.error("API 요청 실패:", error);
        // setStore(null);
        navigate("/404", { replace: true });
      }
    };

    storeInfo();
  }, [sellerId, navigate]);

  return { store, sellerId };

  // const { sellerRegisterDto, sellerInformationDto, sellerPhotoDto } = store;
}
