import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function useStoreInfo() {
   const { sellerId } = useParams();
   const [store, setStore] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const storeInfo = async () => {
      try {
        const response = await axios.get(`http://localhost/api/sellers/${sellerId}`);
        console.log("API 응답:", response.data);

        const sellerInformationDto = response.data.data.seller;

        setStore({
          sellerInformationDto,
          sellerPhotoDto: null,
          sellerRegisterDto: null, // 필요한 경우 백에서 받아서 넣기
        });

      } catch (error) {
        console.error("API 요청 실패:", error);
        setStore(null);
      }
    };

    storeInfo();
  }, [sellerId]);

  return { store };

  const { sellerRegisterDto, sellerInformationDto, sellerPhotoDto } = store;
}