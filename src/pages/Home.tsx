import { Link } from 'react-router-dom';

const Home = () => {
  // 인기 여행 패키지 샘플 데이터
  const popularDestinations = [
    {
      id: '1',
      name: '로마, 이탈리아',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      price: 1290000,
      days: 7,
      description: '영원한 도시 로마에서의 특별한 여행. 콜로세움, 바티칸, 트레비 분수 등 고대 유적 탐험.'
    },
    {
      id: '2',
      name: '도쿄, 일본',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHRva3lvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      price: 980000,
      days: 5,
      description: '전통과 현대가 공존하는 도쿄. 신주쿠, 시부야, 아사쿠사 등 일본 문화 체험.'
    },
    {
      id: '3',
      name: '파리, 프랑스',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80',
      price: 1490000,
      days: 6,
      description: '낭만의 도시 파리에서의 환상적인 여행. 에펠탑, 루브르 박물관, 개선문, 노트르담 대성당 관광.'
    },
    {
      id: '4',
      name: '발리, 인도네시아',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1938&q=80',
      price: 890000,
      days: 5,
      description: '신들의 섬 발리에서 즐기는 완벽한 휴양. 아름다운 해변과 우붓의 계단식 논 탐방.'
    },
  ];
  
  // 여행 상품 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80"
            alt="여행 배경 이미지"
            className="w-full h-full object-cover object-center opacity-30"
          />
        </div>
        <div className="container-custom relative z-10 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              특별한 순간을 만드는 <br />
              <span className="text-primary-400">특별한 여행</span>
            </h1>
            <p className="text-xl mb-8">
              TRIP STORE와 함께하는 특별한 해외여행으로 잊지 못할 추억을 만들어 보세요.
              전문가의 세심한 케어와 함께하는 프리미엄 여행 경험을 제공합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/packages" className="btn btn-primary px-8 py-3 text-base">
                여행 패키지 보기
              </Link>
              <Link to="/contact" className="btn btn-secondary px-8 py-3 text-base">
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* 검색 섹션 */}
      <section className="bg-white py-8">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-lg p-6 -mt-16 relative z-20">
            <h2 className="text-xl font-bold mb-4">여행 검색</h2>
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">목적지</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">목적지 선택</option>
                  <option value="europe">유럽</option>
                  <option value="asia">아시아</option>
                  <option value="oceania">오세아니아</option>
                  <option value="america">미주/중남미</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">출발일</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">인원</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5">5명 이상</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full btn btn-primary py-2 text-base"
                >
                  검색하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* 인기 여행지 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">인기 여행 패키지</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              TRIP STORE가 제안하는 가장 인기 있는 여행 패키지입니다.
              지금 예약하고 특별한 가격 혜택을 받아보세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Link to={`/packages/${destination.id}`}>
                  <div className="relative h-48">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2">{destination.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">{destination.days}일</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm text-gray-500">가격</span>
                        <span className="font-bold text-primary-600">{formatPrice(destination.price)}원~</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/packages" className="btn btn-primary px-8 py-3">
              모든 여행 패키지 보기
            </Link>
          </div>
        </div>
      </section>
      
      {/* 특별 프로모션 섹션 */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">특별 프로모션</h2>
            <p className="max-w-2xl mx-auto">
              TRIP STORE의 특별한 프로모션을 통해 더욱 합리적인 가격으로 여행을 즐기세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-primary-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">얼리버드 할인</h3>
              <p className="mb-4">
                출발 3개월 전 예약 시 패키지 상품 10% 할인 혜택을 드립니다.
              </p>
              <Link to="/packages?promotion=early" className="text-primary-300 hover:text-primary-100">
                자세히 보기 &rarr;
              </Link>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-primary-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">그룹 할인</h3>
              <p className="mb-4">
                4인 이상 그룹 예약 시 1인당 50,000원 할인 혜택을 제공합니다.
              </p>
              <Link to="/packages?promotion=group" className="text-primary-300 hover:text-primary-100">
                자세히 보기 &rarr;
              </Link>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-primary-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">시즌 프로모션</h3>
              <p className="mb-4">
                계절별 특가 프로모션으로 인기 여행지를 더욱 저렴하게 만나보세요.
              </p>
              <Link to="/packages?promotion=season" className="text-primary-300 hover:text-primary-100">
                자세히 보기 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* 여행 후기 섹션 */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">고객 여행 후기</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              TRIP STORE와 함께한 고객분들의 생생한 여행 후기입니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                  KM
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">김민수</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "유럽 패키지로 여행했는데, 가이드님이 정말 친절하고 전문적이었어요. 
                숙소나 식사도 모두 만족스러웠고, 일정도 여유롭게 잘 짜여져 있어서 정말 즐거운 여행이 됐습니다. 
                다음에도 TRIP STORE로 여행하고 싶어요!"
              </p>
              <p className="mt-4 text-sm text-gray-500">로마-피렌체-베니스 7일 투어</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                  LJ
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">이지연</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "발리 허니문 패키지로 신혼여행 다녀왔어요! 특별한 추가 서비스로 와인과 
                꽃다발까지 준비해주셔서 너무 감동했습니다. 
                호텔도 프라이빗 풀빌라라 정말 편하고 좋았어요. 정말 추천합니다."
              </p>
              <p className="mt-4 text-sm text-gray-500">발리 5일 허니문 패키지</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                  PJ
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">박준호</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "일본 도쿄 패키지 여행이 처음이라 걱정했는데, 세세한 부분까지 신경써주신 
                덕분에 불편함 없이 여행했습니다. 특히 현지 맛집 투어가 정말 좋았어요. 
                다음에는 오사카 패키지도 이용해보고 싶네요."
              </p>
              <p className="mt-4 text-sm text-gray-500">도쿄 5일 문화 탐방 패키지</p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/reviews" className="btn btn-secondary px-8 py-3">
              모든 후기 보기
            </Link>
          </div>
        </div>
      </section>
      
      {/* 뉴스레터 구독 섹션 */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">특가 소식 받기</h2>
            <p className="text-gray-600 mb-6">
              TRIP STORE의 특별 프로모션과 할인 정보를 가장 먼저 받아보세요.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button type="submit" className="btn btn-primary px-6 py-3 whitespace-nowrap">
                구독하기
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              구독 신청 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
