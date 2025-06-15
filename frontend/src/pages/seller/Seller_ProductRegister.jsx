import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/seller/Seller_ProductRegister.css";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import seller_camera from "../../image/icon/seller_icon/seller_camera.png";

const Seller_ProductRegister = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        originalPrice: "",
        stockQuantity: "",
        expiryDate: "",
        minDiscountRate: "",
        maxDiscountRate: "",
        categoryId: "",
        status: "1"
    });

    const [productImages, setProductImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 카테고리 옵션 (실제 DB 데이터와 매칭)
    const categories = [
        { id: 1, name: "과일" },
        { id: 2, name: "채소" },
        { id: 3, name: "과자/초콜릿/시리얼" },
        { id: 4, name: "쌀/잡곡" },
        { id: 5, name: "수산물/건어물" },
        { id: 6, name: "커피/음료/차" },
        { id: 7, name: "생수/음료" },
        { id: 8, name: "축산/계란" },
        { id: 9, name: "떡/조리/가공식품" },
        { id: 10, name: "유제품/아이스크림" },
        { id: 11, name: "아이스크림" },
        { id: 12, name: "냉장/냉동/간편요리" },
        { id: 13, name: "건강 식품" },
        { id: 14, name: "분유/어린이식품" },
        { id: 15, name: "선물세트" },
        { id: 16, name: "반찬/간편식/대용식" },
        { id: 17, name: "빵/베이커리" }
    ];

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 이미지 선택 핸들러
    const handleImageSelect = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (productImages.length + files.length > 5) {
            alert("이미지는 최대 5장까지만 업로드할 수 있습니다.");
            return;
        }

        // 새로운 이미지 파일들 추가
        setProductImages(prev => [...prev, ...files]);

        // 미리보기 이미지 URL 생성
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    };

    // 이미지 삭제 핸들러
    const handleImageRemove = (index) => {
        // 미리보기 URL 해제
        URL.revokeObjectURL(previewImages[index]);

        setProductImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    // 폼 유효성 검사
    const validateForm = () => {
        const requiredFields = [
            'name', 'description', 'originalPrice', 'stockQuantity',
            'expiryDate', 'minDiscountRate', 'maxDiscountRate', 'categoryId'
        ];

        for (let field of requiredFields) {
            if (!formData[field]) {
                alert(`${getFieldLabel(field)}을(를) 입력해주세요.`);
                return false;
            }
        }

        if (parseInt(formData.minDiscountRate) > parseInt(formData.maxDiscountRate)) {
            alert("최소 할인율이 최대 할인율보다 클 수 없습니다.");
            return false;
        }

        if (productImages.length === 0) {
            alert("상품 이미지를 최소 1장 이상 업로드해주세요.");
            return false;
        }

        return true;
    };

    const getFieldLabel = (field) => {
        const labels = {
            name: "상품명",
            description: "상품 설명",
            originalPrice: "원가",
            stockQuantity: "재고 수량",
            expiryDate: "유통기한",
            minDiscountRate: "최소 할인율",
            maxDiscountRate: "최대 할인율",
            categoryId: "카테고리"
        };
        return labels[field] || field;
    };

    // 상품 등록 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // FormData 생성
            const submitData = new FormData();

            // ProductDto 데이터를 JSON으로 추가
            const productDto = {
                ...formData,
                originalPrice: parseInt(formData.originalPrice),
                stockQuantity: parseInt(formData.stockQuantity),
                minDiscountRate: parseInt(formData.minDiscountRate),
                maxDiscountRate: parseInt(formData.maxDiscountRate),
                categoryId: parseInt(formData.categoryId),
                expiryDate: new Date(formData.expiryDate).toISOString(),
                createdAt: new Date().toISOString()
            };

            submitData.append('productDto', new Blob([JSON.stringify(productDto)], {
                type: 'application/json'
            }));

            // 이미지 파일들 추가
            productImages.forEach((file) => {
                submitData.append('photoImages', file);
            });

            // API 호출
            const response = await axios.post(
                "http://localhost/api/products",
                submitData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert("상품이 성공적으로 등록되었습니다!");
            navigate("/seller/product/management");

        } catch (error) {
            console.error("상품 등록 실패:", error);
            const errorMessage = error.response?.data?.message || "상품 등록에 실패했습니다.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 취소 핸들러
    const handleCancel = () => {
        if (window.confirm("작성 중인 내용이 삭제됩니다. 정말 취소하시겠습니까?")) {
            // 미리보기 URL들 해제
            previewImages.forEach(url => URL.revokeObjectURL(url));
            navigate("/seller/product/management");
        }
    };

    return (
        <div>
            <Seller_Header />
            <div className="seller-product-register">
                <div className="register-header">
                    <h2>상품 등록</h2>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {/* 상품명 */}
                    <div className="form-group">
                        <label className="form-label">
                            상품명 <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="상품명을 입력해주세요"
                            className="form-input"
                            maxLength={20}
                        />
                        <div className="char-count">{formData.name.length}/20</div>
                    </div>

                    {/* 상품 설명 */}
                    <div className="form-group">
                        <label className="form-label">
                            상품 설명 <span className="required">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="상품에 대한 상세한 설명을 입력해주세요"
                            className="form-textarea"
                            rows={4}
                        />
                    </div>

                    {/* 상품 이미지 */}
                    <div className="form-group">
                        <label className="form-label">
                            상품 이미지 <span className="required">*</span>
                        </label>
                        <div className="image-upload-section">
                            <div className="image-grid">
                                {previewImages.map((url, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={url} alt={`상품 이미지 ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="image-remove-btn"
                                            onClick={() => handleImageRemove(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                {productImages.length < 5 && (
                                    <div className="image-upload-box" onClick={handleImageSelect}>
                                        <img src={seller_camera} alt="이미지 추가" className="camera-icon" />
                                        <span>이미지 추가</span>
                                        <span className="image-count">({productImages.length}/5)</span>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                            />

                            <div className="image-help-text">
                                * 이미지는 최대 5장까지 업로드 가능합니다.
                            </div>
                        </div>
                    </div>

                    {/* 가격 정보 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                원가 <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleInputChange}
                                placeholder="원가를 입력해주세요"
                                className="form-input"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                재고 수량 <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                placeholder="재고 수량"
                                className="form-input"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* 할인율 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                최소 할인율 <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="minDiscountRate"
                                value={formData.minDiscountRate}
                                onChange={handleInputChange}
                                placeholder="최소 할인율 (%)"
                                className="form-input"
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                최대 할인율 <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="maxDiscountRate"
                                value={formData.maxDiscountRate}
                                onChange={handleInputChange}
                                placeholder="최대 할인율 (%)"
                                className="form-input"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    {/* 유통기한 및 카테고리 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                유통기한 <span className="required">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                카테고리 <span className="required">*</span>
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel-btn"
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "등록 중..." : "상품 등록"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Seller_ProductRegister;