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
        const requests = sellerIds.map((id) =>
          axios.get(`http://localhost/api/sellers/${id}`)
        );

        const responses = await Promise.allSettled(requests);
        const validStores = responses
          .map((res, idx) => {
            if (res.status !== "fulfilled") return null;

            const sellerData = res.value?.data?.data?.seller;

            if (!sellerData || typeof sellerData !== "object") return null;

            // ✅ sellerId가 없다면 수동 주입
            return {
              ...sellerData,
              sellerId: sellerIds[idx], // ✅ 요청 보낸 순서를 기준으로 매칭
            };
          })
          .filter((s) => s !== null);

        const picked = shuffleAndPick(validStores, maxCount);
        setStores(picked);
        initialized.current = true; // ✅ 한 번만 실행되도록 설정
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
