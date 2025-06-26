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
        const response = await axios.get(`http://3.39.239.179/api/sellers/${sellerId}`);
        console.log("API 응답:", response.data);

        const sellerInformationDto = response.data.data.seller;
        console.log(sellerInformationDto);
        if (!sellerInformationDto) {
          navigate("/404", { replace: true });
          return;
        }

        //이미지 URL 생성
        const sellerPhotoUrls = sellerInformationDto.sellerPhotos
            ?.filter(photo => !photo.photoUrl.endsWith('.txt')) // .txt 파일 제외
            ?.map(photo => `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${photo.photoUrl}`) || [];

        setStore({
          sellerInformationDto: {
            ...sellerInformationDto,
            sellerPhotoUrls // URL 배열 추가
          },
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
