import { useState, useEffect } from "react";
import "../../css/seller/Seller_newstoreRegistration.css";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import seller_camera from "../../image/icon/seller_icon/seller_camera.png";
import api, { API_BASE_URL } from "../../api/config.js";

const Seller_newstoreRegistration = () => {
  // 기본 매장 정보
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");

  // 배달 관련
  const [deliveryStatus, setDeliveryStatus] = useState("DECLINE");
  const [amountInputs, setAmountInputs] = useState([{ min: "", fee: "" }]);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState("");

  // 카테고리 및 시간
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [storeTime, setStoreTime] = useState("");

  // 공지사항
  const [description, setDescription] = useState("");

  // 🔥 수정된 이미지 상태 관리
  const [storeImages, setStoreImages] = useState([]);
  const [storeImageFiles, setStoreImageFiles] = useState([]);
  const [originalStoreImages, setOriginalStoreImages] = useState([]); // 원본 데이터 (ID 포함)
  const [deletedStoreImageIds, setDeletedStoreImageIds] = useState([]); // 삭제할 ID 목록

  const [noticeImages, setNoticeImages] = useState([]);
  const [noticeImageFiles, setNoticeImageFiles] = useState([]);
  const [originalNoticeImages, setOriginalNoticeImages] = useState([]); // 원본 데이터 (ID 포함)
  const [deletedNoticeImageIds, setDeletedNoticeImageIds] = useState([]); // 삭제할 ID 목록

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);

  const S3_BASE_URL = "https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/";

  // 카테고리 매핑
  const categories = [
    { id: 1, name: "편의점" },
    { id: 2, name: "마트" },
    { id: 3, name: "빵집" },
    { id: 4, name: "식당" },
  ];

  // 쿠키에서 값 추출 함수
  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // 페이지 로드시 기존 매장 정보 불러오기
  useEffect(() => {
    fetchSellerInfo();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // 이미 완전한 URL인 경우 (http 또는 https로 시작)
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // 상대 경로인 경우 S3 base URL 추가
    return S3_BASE_URL + imageUrl;
  };

  // 🔥 수정된 fetchSellerInfo 함수 - SellerPhotoDto 구조 처리
  // 🔥 강화된 디버깅 fetchSellerInfo 함수
  const fetchSellerInfo = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        getCookieValue("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await api.get("/api/sellers/me", {
        headers,
      });

      if (response.status === 200) {
        console.log("🔍 전체 API 응답:", JSON.stringify(response.data, null, 2));

        const responseData = response.data;
        const sellerInfo = responseData.data?.sellerInformationDto;

        if (!sellerInfo) {
          console.warn("sellerInformationDto가 응답에 없습니다:", responseData);
          return;
        }

        console.log("🔍 sellerInfo의 모든 키:", Object.keys(sellerInfo));
        console.log("🔍 sellerInfo 전체 객체:", sellerInfo);

        // 🔥 사진 필드 존재 여부 상세 확인
        console.log("🔍 sellerPhotos 필드 존재:", "sellerPhotos" in sellerInfo);
        console.log("🔍 sellerPhotoUrls 필드 존재:", "sellerPhotoUrls" in sellerInfo);
        console.log(
          "🔍 notificationPhotos 필드 존재:",
          "notificationPhotos" in sellerInfo
        );

        // 🔥 실제 데이터 값 확인
        console.log("🔍 sellerInfo.sellerPhotos 값:", sellerInfo.sellerPhotos);
        console.log("🔍 sellerInfo.sellerPhotoUrls 값:", sellerInfo.sellerPhotoUrls);
        console.log(
          "🔍 sellerInfo.notificationPhotos 값:",
          sellerInfo.notificationPhotos
        );

        // 기본 정보 설정
        setStoreName(sellerInfo.storeName || "");
        setStoreDescription(sellerInfo.storeDescription || "");
        setPhone(sellerInfo.phone || "");
        setPickupTime(sellerInfo.pickupTime || "");
        setMinOrderAmount(sellerInfo.minOrderAmount?.toString() || "");
        setDeliveryStatus(sellerInfo.deliveryAvailable === "Y" ? "ACCEPT" : "DECLINE");
        setDeliveryArea(sellerInfo.deliveryArea || "");
        setStoreTime(sellerInfo.operatingHours || "");
        setDescription(sellerInfo.notification || "");

        const category = categories.find((cat) => cat.id === sellerInfo.categoryId);
        if (category) {
          setSelectedCategory(category.name);
          setCategoryId(sellerInfo.categoryId.toString());
        }

        // 배달비 설정
        if (sellerInfo.deliveryFeeDtos && sellerInfo.deliveryFeeDtos.length > 0) {
          const existingDeliveryFees = sellerInfo.deliveryFeeDtos.map((fee) => ({
            id: fee.id,
            min: fee.ordersMoney?.toString() || "",
            fee: fee.deliveryTip?.toString() || "",
          }));
          setAmountInputs(existingDeliveryFees);
        } else {
          setAmountInputs([{ min: "", fee: "" }]);
        }

        // 🔥 사진 데이터 확인 및 처리
        const existingStorePhotos =
          sellerInfo.sellerPhotos || sellerInfo.sellerPhotoUrls || [];
        const existingNoticePhotos = sellerInfo.notificationPhotos || [];

        console.log("🔍 추출된 매장 사진 데이터:", existingStorePhotos);
        console.log("🔍 추출된 공지 사진 데이터:", existingNoticePhotos);
        console.log("🔍 매장 사진 배열 길이:", existingStorePhotos.length);
        console.log("🔍 공지 사진 배열 길이:", existingNoticePhotos.length);

        // 🔥 각 사진 요소의 타입과 구조 상세 분석
        existingStorePhotos.forEach((photo, index) => {
          console.log(`🔍 매장 사진 [${index}] 전체:`, photo);
          console.log(`🔍 매장 사진 [${index}] 타입:`, typeof photo);
          console.log(`🔍 매장 사진 [${index}] Array.isArray:`, Array.isArray(photo));
          console.log(`🔍 매장 사진 [${index}] null 체크:`, photo === null);
          console.log(`🔍 매장 사진 [${index}] undefined 체크:`, photo === undefined);

          if (typeof photo === "object" && photo !== null) {
            console.log(`🔍 매장 사진 [${index}] 객체 키들:`, Object.keys(photo));
            console.log(`🔍 매장 사진 [${index}] 객체 값들:`, Object.values(photo));
            console.log(`🔍 매장 사진 [${index}] id 값:`, photo.id);
            console.log(`🔍 매장 사진 [${index}] photoUrl 값:`, photo.photoUrl);
          }
        });

        existingNoticePhotos.forEach((photo, index) => {
          console.log(`🔍 공지 사진 [${index}] 전체:`, photo);
          console.log(`🔍 공지 사진 [${index}] 타입:`, typeof photo);
          console.log(`🔍 공지 사진 [${index}] Array.isArray:`, Array.isArray(photo));
          console.log(`🔍 공지 사진 [${index}] null 체크:`, photo === null);
          console.log(`🔍 공지 사진 [${index}] undefined 체크:`, photo === undefined);

          if (typeof photo === "object" && photo !== null) {
            console.log(`🔍 공지 사진 [${index}] 객체 키들:`, Object.keys(photo));
            console.log(`🔍 공지 사진 [${index}] 객체 값들:`, Object.values(photo));
            console.log(`🔍 공지 사진 [${index}] id 값:`, photo.id);
            console.log(`🔍 공지 사진 [${index}] photoUrl 값:`, photo.photoUrl);
          }
        });

        // 나머지 처리 로직...
        const processedStoreImages = existingStorePhotos
          .map((photo, index) => {
            if (typeof photo === "string") {
              console.log(`⚠️ 매장 사진 ${index}는 문자열 형태 (ID 없음):`, photo);
              return {
                id: null,
                photoUrl: photo,
                displayUrl: getImageUrl(photo),
                index: index,
              };
            } else if (photo && typeof photo === "object") {
              const photoId = photo.id;
              const photoUrl = photo.photoUrl;

              console.log(
                `✅ 매장 사진 ${index} - ID: ${photoId} (타입: ${typeof photoId}), URL: ${photoUrl}`
              );

              return {
                id: photoId,
                photoUrl: photoUrl,
                displayUrl: getImageUrl(photoUrl),
                index: index,
              };
            }
            return null;
          })
          .filter((item) => item !== null);

        const processedNoticeImages = existingNoticePhotos
          .map((photo, index) => {
            if (typeof photo === "string") {
              console.log(`⚠️ 공지 사진 ${index}는 문자열 형태 (ID 없음):`, photo);
              return {
                id: null,
                photoUrl: photo,
                displayUrl: getImageUrl(photo),
                index: index,
              };
            } else if (photo && typeof photo === "object") {
              const photoId = photo.id;
              const photoUrl = photo.photoUrl;

              console.log(
                `✅ 공지 사진 ${index} - ID: ${photoId} (타입: ${typeof photoId}), URL: ${photoUrl}`
              );

              return {
                id: photoId,
                photoUrl: photoUrl,
                displayUrl: getImageUrl(photoUrl),
                index: index,
              };
            }
            return null;
          })
          .filter((item) => item !== null);

        console.log("✅ 최종 처리된 매장 사진 (ID 포함):", processedStoreImages);
        console.log("✅ 최종 처리된 공지 사진 (ID 포함):", processedNoticeImages);

        setOriginalStoreImages(processedStoreImages);
        setOriginalNoticeImages(processedNoticeImages);

        // 화면에 표시할 URL 배열
        const storePhotoUrls = processedStoreImages.map((item) => item.displayUrl);
        const noticePhotoUrls = processedNoticeImages.map((item) => item.displayUrl);

        setStoreImages(storePhotoUrls);
        setNoticeImages(noticePhotoUrls);
      }
    } catch (error) {
      console.error("매장 정보 조회 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = "/selogin";
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다.");
      } else {
        alert("매장 정보를 불러오는데 실패했습니다.");
      }
    }
  };

  // 🔥 사진 개수 계산 함수들
  const getTotalStoreImageCount = () => {
    const existingCount = originalStoreImages.length - deletedStoreImageIds.length;
    const newFileCount = storeImageFiles.filter((file) => file instanceof File).length;
    return existingCount + newFileCount;
  };

  const getTotalNoticeImageCount = () => {
    const existingCount = originalNoticeImages.length - deletedNoticeImageIds.length;
    const newFileCount = noticeImageFiles.filter((file) => file instanceof File).length;
    return existingCount + newFileCount;
  };

  // 🔥 수정된 매장 사진 삭제 함수
  const handleDeleteStoreImage = (index) => {
    console.log(`🔴 매장 사진 ${index} 삭제 요청`);
    console.log("🔴 현재 originalStoreImages:", originalStoreImages);
    console.log("🔴 현재 삭제된 ID 목록:", deletedStoreImageIds);

    // 기존 사진인지 새로 추가된 사진인지 확인
    if (index < originalStoreImages.length) {
      // 기존 사진 삭제 - ID를 삭제 목록에 추가
      const photoToDelete = originalStoreImages[index];
      console.log("🔴 삭제할 사진 객체:", photoToDelete);

      if (photoToDelete && photoToDelete.id !== null && photoToDelete.id !== undefined) {
        setDeletedStoreImageIds((prev) => {
          const newList = [...prev, photoToDelete.id];
          console.log(
            `✅ 매장 사진 삭제 ID 추가: ${photoToDelete.id}, 새 목록:`,
            newList
          );
          return newList;
        });
      } else {
        console.log(`⚠️ 매장 사진 ID 없음: ${photoToDelete?.photoUrl || "unknown"}`);
      }
    } else {
      console.log("🔴 새로 추가된 사진이므로 ID 수집 불필요");
    }

    // 화면에서 해당 이미지 제거
    const updatedImages = storeImages.filter((_, i) => i !== index);
    const updatedFiles = storeImageFiles.filter((_, i) => i !== index);

    setStoreImages(updatedImages);
    setStoreImageFiles(updatedFiles);

    console.log("🔴 삭제 후 매장 사진:", updatedImages);
  };

  // 🔥 수정된 공지 사진 삭제 함수
  const handleDeleteNoticeImage = (index) => {
    console.log(`🔴 공지 사진 ${index} 삭제 요청`);
    console.log("🔴 현재 originalNoticeImages:", originalNoticeImages);

    // 기존 사진인지 새로 추가된 사진인지 확인
    if (index < originalNoticeImages.length) {
      // 기존 사진 삭제 - ID를 삭제 목록에 추가
      const photoToDelete = originalNoticeImages[index];
      console.log("🔴 삭제할 공지 사진 객체:", photoToDelete);

      if (photoToDelete && photoToDelete.id !== null && photoToDelete.id !== undefined) {
        setDeletedNoticeImageIds((prev) => {
          const newList = [...prev, photoToDelete.id];
          console.log(
            `✅ 공지 사진 삭제 ID 추가: ${photoToDelete.id}, 새 목록:`,
            newList
          );
          return newList;
        });
      } else {
        console.log(`⚠️ 공지 사진 ID 없음: ${photoToDelete?.photoUrl || "unknown"}`);
      }
    } else {
      console.log("🔴 새로 추가된 사진이므로 ID 수집 불필요");
    }

    // 화면에서 해당 이미지 제거
    const updatedImages = noticeImages.filter((_, i) => i !== index);
    const updatedFiles = noticeImageFiles.filter((_, i) => i !== index);

    setNoticeImages(updatedImages);
    setNoticeImageFiles(updatedFiles);

    console.log("🔴 삭제 후 공지 사진:", updatedImages);
  };

  // 🔥 수정된 매장 사진 추가 함수
  const handleAddStoreImage = () => {
    const totalCount = getTotalStoreImageCount();
    if (totalCount >= 5) {
      alert("매장 사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }
    setStoreImages([...storeImages, null]);
  };

  // 매장 사진 마지막 제거
  const handleRemoveStoreImage = () => {
    if (storeImages.length > 0) {
      setStoreImages(storeImages.slice(0, -1));
      setStoreImageFiles(storeImageFiles.slice(0, -1));
    }
  };

  // 매장 사진 파일 변경
  const handleStoreImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // 새 파일 추가 시 총 개수 확인
      const currentNewFiles = storeImageFiles.filter((f) => f instanceof File).length;
      const remainingExisting = originalStoreImages.length - deletedStoreImageIds.length;

      // 현재 슬롯이 새 파일인지 확인
      const isNewSlot =
        index >= originalStoreImages.length || storeImageFiles[index] instanceof File;
      const totalAfterAdd = remainingExisting + currentNewFiles + (isNewSlot ? 1 : 0);

      if (totalAfterAdd > 5) {
        alert("매장 사진은 최대 5장까지 등록할 수 있습니다.");
        return;
      }

      const updatedImages = [...storeImages];
      const updatedFiles = [...storeImageFiles];

      // 새 파일로 교체
      updatedImages[index] = URL.createObjectURL(file);

      // 파일 배열 크기 맞추기
      while (updatedFiles.length <= index) {
        updatedFiles.push(null);
      }
      updatedFiles[index] = file;

      setStoreImages(updatedImages);
      setStoreImageFiles(updatedFiles);

      console.log(`매장 사진 ${index} 변경:`, file.name);
    }
  };

  // 🔥 수정된 공지 사진 추가 함수
  const handleAddNoticeImage = () => {
    const totalCount = getTotalNoticeImageCount();
    if (totalCount >= 5) {
      alert("공지 사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }
    setNoticeImages([...noticeImages, null]);
  };

  const handleRemoveNoticeImage = () => {
    if (noticeImages.length > 0) {
      setNoticeImages(noticeImages.slice(0, -1));
      setNoticeImageFiles(noticeImageFiles.slice(0, -1));
    }
  };

  const handleNoticeImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // 새 파일 추가 시 총 개수 확인
      const currentNewFiles = noticeImageFiles.filter((f) => f instanceof File).length;
      const remainingExisting =
        originalNoticeImages.length - deletedNoticeImageIds.length;

      // 현재 슬롯이 새 파일인지 확인
      const isNewSlot =
        index >= originalNoticeImages.length || noticeImageFiles[index] instanceof File;
      const totalAfterAdd = remainingExisting + currentNewFiles + (isNewSlot ? 1 : 0);

      if (totalAfterAdd > 5) {
        alert("공지 사진은 최대 5장까지 등록할 수 있습니다.");
        return;
      }

      const updatedImages = [...noticeImages];
      const updatedFiles = [...noticeImageFiles];

      updatedImages[index] = URL.createObjectURL(file);

      while (updatedFiles.length <= index) {
        updatedFiles.push(null);
      }
      updatedFiles[index] = file;

      setNoticeImages(updatedImages);
      setNoticeImageFiles(updatedFiles);

      console.log(`공지 사진 ${index} 변경:`, file.name);
    }
  };

  // 배달 관련 함수들
  const handleAddInput = () => {
    setAmountInputs([...amountInputs, { min: "", fee: "" }]);
  };

  const handleRemoveInput = () => {
    if (amountInputs.length > 1) {
      const lastIndex = amountInputs.length - 1;
      const lastItem = amountInputs[lastIndex];

      // 기존 데이터(ID가 있는)라면 deleted 플래그 설정
      if (lastItem.id) {
        const updated = [...amountInputs];
        updated[lastIndex] = { ...lastItem, deleted: true };
        setAmountInputs(updated);
        console.log(`배달비 ${lastItem.id} 삭제 플래그 설정`);
      } else {
        // 새로 추가된 데이터라면 배열에서 제거
        setAmountInputs(amountInputs.slice(0, -1));
        console.log("새 배달비 항목 제거");
      }
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...amountInputs];
    updated[index][field] = value;
    setAmountInputs(updated);
  };

  const handleSelect = (category) => {
    setSelectedCategory(category.name);
    setCategoryId(category.id);
    setIsOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!storeName || !storeName.trim()) newErrors.storeName = "매장이름은 필수입니다.";
    if (!phone || !phone.trim()) newErrors.phone = "전화번호는 필수입니다.";
    if (!pickupTime || !pickupTime.trim())
      newErrors.pickupTime = "픽업시간은 필수입니다.";
    if (!storeTime || !storeTime.trim())
      newErrors.operatingHours = "영업시간은 필수입니다.";
    if (!categoryId || categoryId === "" || isNaN(parseInt(categoryId))) {
      newErrors.categoryId = "매장 카테고리는 필수입니다.";
    }
    if (!deliveryStatus || deliveryStatus === "") {
      newErrors.deliveryStatus = "배달 여부는 필수입니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("폼 검증 에러:", newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };
  const visibleAmountInputs = amountInputs.filter((input) => !input.deleted);
  // 🔥 수정된 handleSubmit 함수
  const handleSubmit = async () => {
    console.log("🚀 매장 정보 저장 시작");
    console.log("🚀 현재 deletedStoreImageIds:", deletedStoreImageIds);
    console.log("🚀 현재 deletedNoticeImageIds:", deletedNoticeImageIds);

    if (!validateForm()) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 🔥 사진 개수 최종 검증
    const finalStoreCount = getTotalStoreImageCount();
    const finalNoticeCount = getTotalNoticeImageCount();

    if (finalStoreCount > 5) {
      alert("매장 사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }

    if (finalNoticeCount > 5) {
      alert("공지 사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      const sellerInfo = {
        storeName: storeName.trim(),
        deliveryAvailable: deliveryStatus === "ACCEPT" ? "Y" : "N",
        operatingHours: storeTime.trim(),
        categoryId: categoryId ? parseInt(categoryId) : null,
        phone: phone.trim(),
        pickupTime: pickupTime.trim(),
        storeDescription: storeDescription || "",
        notification: description || "",
        minOrderAmount: minOrderAmount || "0",
        deliveryArea: deliveryArea || "",

        deliveryFeeDtos: amountInputs
          .filter((input) => input.min && input.fee)
          .map((input) => ({
            id: input.id || null,
            ordersMoney: parseInt(input.min) || 0,
            deliveryTip: freeDelivery ? 0 : parseInt(input.fee) || 0,
            deleted: input.deleted || false,
          })),

        // 🔥 삭제할 사진 ID 목록 전송
        sellerPhotoIds: deletedStoreImageIds
          .map((id) => {
            const numericId = parseInt(id);
            console.log(`🔥 매장 사진 ID 변환: ${id} -> ${numericId}`);
            return numericId;
          })
          .filter((id) => !isNaN(id)),

        notificationPhotoIds: deletedNoticeImageIds
          .map((id) => {
            const numericId = parseInt(id);
            console.log(`🔥 공지 사진 ID 변환: ${id} -> ${numericId}`);
            return numericId;
          })
          .filter((id) => !isNaN(id)),
      };

      console.log("🚀 최종 전송할 sellerInfo:", sellerInfo);

      if (!sellerInfo.categoryId) {
        alert("매장 카테고리를 선택해주세요.");
        setLoading(false);
        return;
      }

      formData.append(
        "sellerInformationDto",
        new Blob([JSON.stringify(sellerInfo)], {
          type: "application/json",
        })
      );

      // 새로 업로드된 파일들만 전송
      const newStoreFiles = storeImageFiles.filter(
        (file) => file instanceof File && file.size > 0
      );
      const newNoticeFiles = noticeImageFiles.filter(
        (file) => file instanceof File && file.size > 0
      );

      console.log("🚀 전송할 새 매장 파일:", newStoreFiles);
      console.log("🚀 전송할 새 공지 파일:", newNoticeFiles);

      if (newStoreFiles.length > 0) {
        newStoreFiles.forEach((file) => {
          formData.append("storeImage", file);
        });
        console.log("🚀 새 매장 이미지 전송:", newStoreFiles.length, "개");
      }

      if (newNoticeFiles.length > 0) {
        newNoticeFiles.forEach((file) => {
          formData.append("notificationImage", file);
        });
        console.log("🚀 새 공지 이미지 전송:", newNoticeFiles.length, "개");
      }

      // JWT 토큰 가져오기
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        getCookieValue("token");

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await api.put("/api/sellers", formData, {
        headers,
      });

      if (response.status === 200) {
        alert("매장 정보가 성공적으로 업데이트되었습니다!");
        window.location.href = "/Seller_Main";
      }
    } catch (error) {
      console.error("🚀 매장 정보 업데이트 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = "/selogin";
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다.");
      } else if (error.response?.status === 400) {
        alert("입력 정보를 확인해주세요.");
      } else if (error.response?.status === 500) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("매장 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seller_Header />

      <div className="seller-store-registration">
        <div className="seller-store-container">
          <div className="seller-form-container">
            {/* 기본 정보 */}
            <section className="seller-info-card">

             {/* 상단 제목 */}
            <div className="status-store-header">
              <h1 className="store-title">판매자 매장 정보 등록 및 수정</h1>
              <p className="store-subtitle">가게의 매장 정보를 등록 및 수정을 해보세요</p>
            </div>

              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">🏪</span>
                  <h3>기본 정보</h3>
                </div>
                <p className="seller-card-subtitle">
                  매장의 기본적인 정보를 입력해주세요
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-form-grid">
                  <div className="seller-form-field">
                    <label className="seller-label">
                      매장이름 <span className="seller-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="seller-input"
                      placeholder="매장이름을 입력해주세요"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>

                  <div className="seller-form-field">
                    <label className="seller-label">
                      전화번호 <span className="seller-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="seller-input"
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="seller-form-field">
                    <label className="seller-label">
                      픽업 소요시간 <span className="seller-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="seller-input"
                      placeholder="예: 30분"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="seller-form-field seller-full-width">
                  <label className="seller-label">매장 설명</label>
                  <textarea
                    className="seller-textarea"
                    placeholder="500자 이내로 매장을 소개해주세요"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    maxLength="500"
                    rows="4"
                  />
                  <div className="seller-char-counter">{storeDescription.length}/500</div>
                </div>
              </div>
            </section>

            {/* 운영 정보 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">⏰</span>
                  <h3>운영 정보</h3>
                </div>
                <p className="seller-card-subtitle">
                  매장 카테고리와 영업시간을 설정해주세요
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-form-grid">
                  <div className="seller-form-field">
                    <label className="seller-label">
                      매장 카테고리 <span className="seller-required">*</span>
                    </label>
                    <div className="seller-select-container">
                      <button
                        type="button"
                        className="seller-select-trigger"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <span>{selectedCategory || "카테고리를 선택해주세요"}</span>
                        <span
                          className={`seller-arrow ${isOpen ? "seller-arrow-open" : ""}`}
                        >
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="seller-select-dropdown">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              onClick={() => handleSelect(cat)}
                              className="seller-select-option"
                            >
                              {cat.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="seller-form-field seller-full-width">
                  <label className="seller-label">
                    영업시간 <span className="seller-required">*</span>
                  </label>
                  <textarea
                    className="seller-textarea"
                    value={storeTime}
                    onChange={(e) => setStoreTime(e.target.value)}
                    placeholder="예시:
월요일 09:00 ~ 18:00
화요일 09:00 ~ 18:00
수요일 09:00 ~ 18:00
목요일 09:00 ~ 18:00
금요일 09:00 ~ 18:00
토요일 09:00 ~ 18:00
일요일 09:00 ~ 18:00"
                    rows="6"
                  />
                </div>
              </div>
            </section>

            {/* 매장 사진 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">📸</span>
                  <h3>매장 사진</h3>
                </div>
                <p className="seller-card-subtitle">
                  매장의 모습을 보여주는 사진을 업로드하세요 (최대 5장) - 현재:{" "}
                  {getTotalStoreImageCount()}/5
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-image-grid">
                  {storeImages.map((img, index) => (
                    <div
                      key={index}
                      className="seller-image-upload-box"
                      style={{ position: "relative" }}
                    >
                      <img
                        src={img || seller_camera}
                        alt="매장 사진"
                        className="seller-image"
                        onClick={() =>
                          document.getElementById(`seller-store-img-${index}`).click()
                        }
                        style={{ cursor: "pointer" }}
                      />

                      {img && img !== seller_camera && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStoreImage(index);
                          }}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "rgba(255, 0, 0, 0.8)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                          }}
                          title="사진 삭제"
                        >
                          ✕
                        </button>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        id={`seller-store-img-${index}`}
                        style={{ display: "none" }}
                        onChange={(e) => handleStoreImageChange(index, e)}
                      />
                    </div>
                  ))}
                </div>
                <div className="seller-button-group">
                  <button
                    type="button"
                    className="seller-btn seller-btn-secondary"
                    onClick={handleAddStoreImage}
                    disabled={getTotalStoreImageCount() >= 5}
                  >
                    사진 추가 ({getTotalStoreImageCount()}/5)
                  </button>
                  <button
                    type="button"
                    className="seller-btn seller-btn-secondary"
                    onClick={handleRemoveStoreImage}
                    disabled={storeImages.length === 0}
                  >
                    마지막 사진 삭제
                  </button>
                </div>
              </div>
            </section>

            {/* 배달 설정 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">🚚</span>
                  <h3>배달 설정</h3>
                </div>
                <p className="seller-card-subtitle">
                  배달 서비스 제공 여부와 배달비를 설정하세요
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-form-field">
                  <label className="seller-label">
                    배달 여부 <span className="seller-required">*</span>
                  </label>
                  <div className="seller-radio-group">
                    <label className="seller-radio-item">
                      <input
                        type="radio"
                        name="delivery"
                        value="ACCEPT"
                        checked={deliveryStatus === "ACCEPT"}
                        onChange={() => setDeliveryStatus("ACCEPT")}
                      />
                      <span className="seller-radio-label">배달 수락</span>
                    </label>
                    <label className="seller-radio-item">
                      <input
                        type="radio"
                        name="delivery"
                        value="DECLINE"
                        checked={deliveryStatus === "DECLINE"}
                        onChange={() => setDeliveryStatus("DECLINE")}
                      />
                      <span className="seller-radio-label">배달 거절</span>
                    </label>
                  </div>
                </div>

                {deliveryStatus === "ACCEPT" && (
                  <>
                    <div className="seller-delivery-section">
                      <label className="seller-label">배달비 설정</label>
                      <div className="seller-delivery-fee-container">
                        {visibleAmountInputs.map((input, index) => (
                          <div key={index} className="seller-delivery-fee-row">
                            <input
                              type="number"
                              placeholder="최소 주문금액"
                              value={index === 0 ? minOrderAmount : input.min}
                              onChange={(e) => {
                                if (index === 0) {
                                  setMinOrderAmount(e.target.value);
                                  handleChange(index, "min", e.target.value);
                                } else {
                                  handleChange(index, "min", e.target.value);
                                }
                              }}
                              className="seller-delivery-input"
                            />
                            <span className="seller-text">원 이상</span>
                            <input
                              type="number"
                              placeholder="배달비"
                              value={input.fee}
                              onChange={(e) => handleChange(index, "fee", e.target.value)}
                              className="seller-delivery-input"
                              disabled={freeDelivery}
                            />
                            <span className="seller-text">원</span>
                          </div>
                        ))}

                        <div className="seller-button-group">
                          <button
                            type="button"
                            className="seller-btn seller-btn-secondary"
                            onClick={handleAddInput}
                          >
                            구간 추가
                          </button>
                          <button
                            type="button"
                            className="seller-btn seller-btn-secondary"
                            onClick={handleRemoveInput}
                            disabled={visibleAmountInputs.length <= 1}
                          >
                            구간 삭제
                          </button>
                        </div>

                        <label className="seller-checkbox-item">
                          <input
                            type="checkbox"
                            checked={freeDelivery}
                            onChange={(e) => setFreeDelivery(e.target.checked)}
                          />
                          <span className="seller-checkbox-label">무료 배달</span>
                        </label>
                      </div>
                    </div>

                    <div className="seller-form-field">
                      <label className="seller-label">배달 가능 지역</label>
                      <input
                        type="text"
                        className="seller-input"
                        placeholder="예: 복현동, 원대동, 침산동"
                        value={deliveryArea}
                        onChange={(e) => setDeliveryArea(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* 가게 공지 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">📢</span>
                  <h3>가게 공지</h3>
                </div>
                <p className="seller-card-subtitle">
                  고객에게 전달하고 싶은 공지사항을 작성하세요 (최대 5장) - 현재:{" "}
                  {getTotalNoticeImageCount()}/5
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-image-grid">
                  {noticeImages.map((img, index) => (
                    <div
                      key={index}
                      className="seller-image-upload-box"
                      style={{ position: "relative" }}
                    >
                      <img
                        src={img || seller_camera}
                        alt="공지 사진"
                        className="seller-image"
                        onClick={() =>
                          document.getElementById(`seller-notice-img-${index}`).click()
                        }
                        style={{ cursor: "pointer" }}
                      />

                      {img && img !== seller_camera && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNoticeImage(index);
                          }}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "rgba(255, 0, 0, 0.8)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                          }}
                          title="사진 삭제"
                        >
                          ✕
                        </button>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        id={`seller-notice-img-${index}`}
                        style={{ display: "none" }}
                        onChange={(e) => handleNoticeImageChange(index, e)}
                      />
                    </div>
                  ))}
                </div>
                <div className="seller-button-group">
                  <button
                    type="button"
                    className="seller-btn seller-btn-secondary"
                    onClick={handleAddNoticeImage}
                    disabled={getTotalNoticeImageCount() >= 5}
                  >
                    사진 추가 ({getTotalNoticeImageCount()}/5)
                  </button>
                  <button
                    type="button"
                    className="seller-btn seller-btn-secondary"
                    onClick={handleRemoveNoticeImage}
                    disabled={noticeImages.length === 0}
                  >
                    마지막 사진 삭제
                  </button>
                </div>

                <div className="seller-form-field seller-full-width">
                  <label className="seller-label">공지 내용</label>
                  <textarea
                    className="seller-textarea"
                    placeholder="고객에게 알리고 싶은 내용을 500자 이내로 작성해주세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength="500"
                    rows="4"
                  />
                  <div className="seller-char-counter">{description.length}/500</div>
                </div>
              </div>
            </section>
          </div>

          {/* 액션 버튼 */}
          <div className="seller-actions">
            <button
              className={`seller-btn seller-btn-primary ${
                loading ? "seller-loading" : ""
              }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "저장 중..." : "매장 정보 저장"}
            </button>
            <button
              className="seller-btn seller-btn-secondary"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Seller_newstoreRegistration;
