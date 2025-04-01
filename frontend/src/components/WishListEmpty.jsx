import React from "react";

const WishListEmpty = () => {
  return (
    <div className="flex flex-col min-h-screen px-4 pt-10">
      {/* 상단 제목 */}
      <h1 className="text-2xl font-semibold mb-4">위시리스트</h1>

      {/* 구분선 */}
      <hr className="border-gray-300 mb-10" />

      {/* 중앙 콘텐츠 */}
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <p className="text-lg font-medium mb-2">찜한 상품이 없습니다.</p>
        <p className="text-sm text-gray-500 mb-6">위시리스트에 찜한 물건을 담아보세요.</p>
        <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">
          오늘의 일반상품 보기 &gt;
        </button>
      </div>
    </div>
  );
};

export default WishListEmpty;
