import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[60vh] md:h-[80vh] text-white flex items-center justify-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight shadow-lg">일상의 쉼표, 특별한 여행의 시작</h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">K-Travel과 함께라면 당신의 모든 여행이 작품이 됩니다.</p>
          <a 
            href="#search-section"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            내게 맞는 여행 찾기
          </a>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-16 bg-white -mt-16 rounded-t-3xl shadow-2xl relative z-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">어디로 떠나고 싶으신가요?</h2>
          <form className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 p-6 bg-gray-100 rounded-xl shadow-lg">
            <input 
              type="text" 
              placeholder="도시나 국가를 입력하세요" 
              className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <select className="w-full md:w-1/4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
              <option>모든 종류</option>
              <option>해외여행</option>
              <option>국내숙소</option>
              <option>골프</option>
              <option>테마여행</option>
            </select>
            <button 
              type="submit" 
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              검색
            </button>
          </form>
        </div>
      </section>

      {/* Recommended Packages Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">추천 여행 패키지</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Package Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300">
              <img src="/images/package-1.jpg" alt="파리" className="w-full h-56 object-cover"/>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">낭만의 도시, 파리 5일</h3>
                <p className="text-gray-600 mb-4">에펠탑과 루브르 박물관, 세느강의 야경까지 완벽한 코스</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">1,800,000원</span>
                  <a href="#" className="text-blue-500 hover:text-blue-700 font-semibold">더보기 &rarr;</a>
                </div>
              </div>
            </div>
            {/* Package Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300">
              <img src="/images/package-2.jpg" alt="도쿄" className="w-full h-56 object-cover"/>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">미식의 천국, 도쿄 3일</h3>
                <p className="text-gray-600 mb-4">신주쿠, 시부야, 아사쿠사를 아우르는 핵심 일정</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">850,000원</span>
                  <a href="#" className="text-blue-500 hover:text-blue-700 font-semibold">더보기 &rarr;</a>
                </div>
              </div>
            </div>
            {/* Package Card 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300">
              <img src="/images/package-3.jpg" alt="제주도" className="w-full h-56 object-cover"/>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">환상의 섬, 제주 3일</h3>
                <p className="text-gray-600 mb-4">에메랄드빛 바다와 오름, 맛집을 모두 즐기는 힐링 여행</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">450,000원</span>
                  <a href="#" className="text-blue-500 hover:text-blue-700 font-semibold">더보기 &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">나만의 맞춤 여행을 원시나요?</h2>
          <p className="text-lg mb-8">전문 플래너가 당신만을 위한 특별한 여행을 설계해 드립니다.</p>
          <a 
            href="#"
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            맞춤 여행 문의하기
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
