import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">총 회원수</h2>
          <p className="text-4xl font-bold">128</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">총 상품수</h2>
          <p className="text-4xl font-bold">45</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">총 예약</h2>
          <p className="text-4xl font-bold">356</p>
        </div>
        <div className="bg-orange-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">이번 달 매출</h2>
          <p className="text-4xl font-bold">₩24.5M</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">최근 활동</h2>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <p className="text-gray-700">
              <span className="font-bold text-blue-600">김지민</span>님이 <span className="font-bold">도쿄 스페셜 패키지</span>를 예약했습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">방금 전</p>
          </div>
          <div className="p-4 border-b border-gray-200">
            <p className="text-gray-700">
              <span className="font-bold text-blue-600">이서준</span>님이 <span className="font-bold">상품 문의</span>를 남겼습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">2시간 전</p>
          </div>
          <div className="p-4 border-b border-gray-200">
            <p className="text-gray-700">
              새 상품 <span className="font-bold">제주 프리미엄 3일</span>이 등록되었습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">5시간 전</p>
          </div>
          <div className="p-4">
            <p className="text-gray-700">
              <span className="font-bold text-blue-600">박지현</span>님이 회원가입 했습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">8시간 전</p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">시스템 알림</h2>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700">주간 백업이 정상적으로 완료되었습니다.</p>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">시스템 업데이트가 필요합니다. 자세한 내용은 관리자에게 문의하세요.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
