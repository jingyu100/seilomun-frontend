const StepTabs = () => {
  return (
    <div className="w-full">
      {/* 탭 줄: 배송 | 포장 */}
      <div className="flex w-full text-center text-[15px] font-bold text-gray-700">
        {/* 배송 탭 */}
        <div className="flex-1 py-2 border-b-2 border-gray-700 border-solid">배송</div>
        {/* 포장 탭 */}
        <div className="flex-1 py-2 border-b border-gray-300 border-solid">포장</div>
      </div>
      {/* 아래 검정 바 */}
      <div className="w-full bg-black text-white text-center font-bold py-2 text-[16px] mb-2">
        주문/결제
      </div>
    </div>
  );
};

export default StepTabs;
