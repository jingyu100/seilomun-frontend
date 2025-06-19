import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function useStoreListByIds(sellerIds = [], maxCount = 12) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialized = useRef(false);

  const shuffleAndPick = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    if (!sellerIds || sellerIds.length === 0 || initialized.current) return;

    const fetchStores = async () => {
      try {
        // 각 요청에 sellerId를 함께 전달
        const requests = sellerIds.map((id) =>
            axios.get(`http://3.36.70.70/api/sellers/${id}`)
                .then(response => ({
                  success: true,
                  sellerId: id, // ✅ 요청한 sellerId를 함께 저장
                  data: response.data?.data?.seller
                }))
                .catch(error => ({
                  success: false,
                  sellerId: id,
                  error
                }))
        );

        const responses = await Promise.all(requests);

        const validStores = responses
            .filter(res => res.success && res.data && typeof res.data === "object")
            .map(res => ({
              ...res.data,
              sellerId: res.sellerId // ✅ 정확한 sellerId 매칭
            }));

        console.log("validStores : ", validStores); // 디버깅용

        const picked = shuffleAndPick(validStores, maxCount);
        setStores(picked);
        initialized.current = true;
      } catch (err) {
        console.error("가게 리스트 로딩 실패", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [sellerIds, maxCount]);

  return { stores, loading, error };
}