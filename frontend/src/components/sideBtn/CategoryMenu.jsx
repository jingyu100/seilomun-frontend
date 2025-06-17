// src/components/sideBtn/CategoryMenu.jsx
import React, { useState, useEffect, useRef } from 'react';

const CategoryMenu = ({ isOpen, onClose, onCategorySelect, buttonRef }) => {
    const menuRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const categoryData = {
        매장: [
            { id: 1, name: '편의점', enum: 'CONVENIENCE_STORE', icon: '🏪' },
            { id: 2, name: '마트', enum: 'MART', icon: '🛒' },
            { id: 3, name: '빵집', enum: 'BAKERY', icon: '🥖' },
            { id: 4, name: '식당', enum: 'RESTAURANT', icon: '🍽️' },
        ],
        식품: [
            { id: 1, name: '과일', enum: 'FRUIT', icon: '🍎' },
            { id: 2, name: '채소', enum: 'VEGETABLE', icon: '🥬' },
            { id: 3, name: '육류', enum: 'MEAT', icon: '🥩' },
            { id: 4, name: '생선', enum: 'FISH', icon: '🐟' },
            { id: 5, name: '유제품', enum: 'DAIRY', icon: '🥛' },
            { id: 6, name: '음료', enum: 'BEVERAGE', icon: '🥤' },
            { id: 7, name: '과자', enum: 'SNACK', icon: '🍪' },
            { id: 8, name: '라면', enum: 'NOODLE', icon: '🍜' },
            { id: 9, name: '쌀', enum: 'RICE', icon: '🍚' },
            { id: 10, name: '조미료', enum: 'SEASONING', icon: '🧂' },
            { id: 11, name: '냉동식품', enum: 'FROZEN', icon: '🧊' },
            { id: 12, name: '통조림', enum: 'CANNED', icon: '🥫' },
            { id: 13, name: '건강식품', enum: 'HEALTH', icon: '💊' },
            { id: 14, name: '아이스크림', enum: 'ICE_CREAM', icon: '🍦' },
            { id: 15, name: '견과류', enum: 'NUTS', icon: '🥜' },
            { id: 16, name: '차/커피', enum: 'TEA_COFFEE', icon: '☕' },
            { id: 17, name: '빵', enum: 'BREAD', icon: '🍞' },
        ],
    };

    // 버튼 위치에 따라 드롭다운 위치 계산
    useEffect(() => {
        if (isOpen && buttonRef?.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: buttonRect.bottom + window.scrollY + 5, // 버튼 아래 5px 간격
                left: buttonRect.left + window.scrollX,
            });
        }
    }, [isOpen, buttonRef]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose]);

    const handleSelect = (mainCat, item) => {
        const payload = {
            type: mainCat === '매장' ? 'SELLER_CATEGORY' : 'PRODUCT_CATEGORY',
            id: item.id,
            name: item.name,
            enum: item.enum,
        };
        onCategorySelect && onCategorySelect(payload);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="search-dropdown category-dropdown"
            ref={menuRef}
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 1000,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                width: '280px',
                maxHeight: '500px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0'
            }}
        >
            <div className="search-section" style={{ padding: '16px' }}>

                {/* 매장 카테고리 */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '8px',
                        padding: '8px 0',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        🏪 매장
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '4px'
                    }}>
                        {categoryData.매장.map((item) => (
                            <div
                                key={`매장-${item.id}`}
                                onClick={() => handleSelect('매장', item)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease',
                                    ':hover': {
                                        backgroundColor: '#f3f4f6'
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f3f4f6';
                                    e.target.style.borderColor = '#d1d5db';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#f9fafb';
                                    e.target.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                                <span style={{ fontWeight: '500' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 식품 카테고리 */}
                <div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '8px',
                        padding: '8px 0',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        🍎 식품
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '4px'
                    }}>
                        {categoryData.식품.map((item) => (
                            <div
                                key={`식품-${item.id}`}
                                onClick={() => handleSelect('식품', item)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f3f4f6';
                                    e.target.style.borderColor = '#d1d5db';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#f9fafb';
                                    e.target.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                                <span style={{ fontWeight: '500' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryMenu;