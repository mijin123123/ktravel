import { useState, useEffect } from 'react';

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const destinations = [
    { name: '오로라, 핀란드', image: '/images/aurora.jpg', tag: '꿈의 여행', color: 'bg-blue-500', description: '밤하늘을 수놓는 경이로운 오로라를 직접 경험해보세요.' },
    { name: '마추픽추, 페루', image: '/images/machu-picchu.jpg', tag: '고대 유적', color: 'bg-emerald-600', description: '잉카 제국의 신비로운 공중 도시, 마추픽추로 떠나는 시간 여행.' },
    { name: '사하라 사막, 모로코', image: '/images/sahara.jpg', tag: '이색 체험', color: 'bg-amber-600', description: '붉은 모래 언덕과 밤하늘의 별, 사하라에서 잊지 못할 하룻밤.' },
    { name: '베네치아, 이탈리아', image: '/images/venice.jpg', tag: '로맨틱', color: 'bg-rose-500', description: '물의 도시 베네치아에서 곤돌라를 타고 낭만적인 순간을 만끽하세요.' }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % destinations.length);
    }, 7000); // 슬라이드 전환 시간을 7초로 늘려 각 슬라이드를 충분히 볼 수 있도록 합니다.
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-neutral-50 min-h-screen text-gray-800 overflow-x-hidden">
      {/* 다이내믹 히어로 섹션 */}
      <section className="relative h-[90vh] overflow-hidden text-white">
        {destinations.map((destination, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
            <img 
              src={destination.image} 
              alt={destination.name}
              className="absolute inset-0 w-full h-full object-cover transform scale-100 transition-transform duration-[8000ms] ease-linear"
              style={{ transform: index === activeSlide ? 'scale(1.15)' : 'scale(1)' }}
            />
          </div>
        ))}

        {/* 슬라이드 컨트롤 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {destinations.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-center px-6">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-500 ${destinations[activeSlide].color}`}>
                {destinations[activeSlide].tag}
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight my-4 drop-shadow-lg">
                {destinations[activeSlide].name}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                {destinations[activeSlide].description}
              </p>
            </div>
            
            {/* 검색 바 */}
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto shadow-2xl border border-white/30">
              <div className="flex-1 flex items-center w-full md:w-auto px-4">
                <svg className="w-6 h-6 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text" 
                  placeholder="가고 싶은 도시나 나라를 검색해보세요" 
                  className="bg-transparent w-full focus:outline-none text-white placeholder-white/70 text-lg"
                />
              </div>
              <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 w-full md:w-auto">
                <span className="hidden md:inline">지금 </span>여행 떠나기
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* 카테고리 섹션 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">당신의 여행 스타일은?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">원하는 여행 스타일을 선택하고 맞춤형 경험을 찾아보세요</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: '해외여행', icon: '✈️', color: 'from-blue-500 to-indigo-600' },
              { title: '국내숙소', icon: '🏨', color: 'from-green-500 to-teal-600' },
              { title: '골프여행', icon: '⛳', color: 'from-yellow-500 to-amber-600' },
              { title: '럭셔리', icon: '💎', color: 'from-purple-500 to-pink-600' },
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 md:p-8 text-center text-white shadow-lg group-hover:shadow-xl transition duration-300 transform group-hover:-translate-y-1`}>
                  <div className="text-4xl md:text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold">{category.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 패키지 섹션 */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">인기 여행 패키지</h2>
              <p className="text-gray-600">많은 여행자들이 선택한 베스트 상품</p>
            </div>
            <a href="#" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
              모든 패키지 보기
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 패키지 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
              <div className="relative">
                <img src="/images/package-1.jpg" alt="파리" className="w-full h-64 object-cover"/>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                  <span className="text-red-500">10% 할인</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-500 ml-2 text-sm">142개 리뷰</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">파리 로맨틱 5일 투어</h3>
                <p className="text-gray-600 mb-4">에펠탑, 루브르 박물관, 개선문을 포함한 완벽한 파리 경험</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-purple-600">1,690,000원</span>
                    <span className="text-sm text-gray-500 line-through ml-2">1,880,000원</span>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                    예약하기
                  </button>
                </div>
              </div>
            </div>
            
            {/* 패키지 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
              <div className="relative">
                <img src="/images/package-2.jpg" alt="도쿄" className="w-full h-64 object-cover"/>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                  <span className="text-green-500">인기상품</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-500 ml-2 text-sm">98개 리뷰</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">도쿄 핵심 일정 3일</h3>
                <p className="text-gray-600 mb-4">신주쿠부터 아사쿠사까지, 도쿄의 모든 매력을 담은 여행</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-purple-600">840,000원</span>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                    예약하기
                  </button>
                </div>
              </div>
            </div>
            
            {/* 패키지 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
              <div className="relative">
                <img src="/images/package-3.jpg" alt="제주도" className="w-full h-64 object-cover"/>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                  <span className="text-blue-500">NEW</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star, idx) => (
                      <svg key={star} className={`w-4 h-4 ${idx >= 4 ? 'text-yellow-200' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-500 ml-2 text-sm">23개 리뷰</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">제주 프리미엄 3일</h3>
                <p className="text-gray-600 mb-4">에코랜드, 카멜리아 힐, 섭지코지를 포함한 럭셔리 일정</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-purple-600">480,000원</span>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                    예약하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 특별 프로모션 */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-800">
            <div className="absolute top-0 right-0 w-1/3 h-full">
              <svg className="w-full h-full text-white/10" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
                <circle cx="75" cy="25" r="20" />
                <circle cx="40" cy="70" r="30" />
                <circle cx="95" cy="80" r="15" />
              </svg>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
              <div className="text-white">
                <span className="inline-block bg-purple-500/30 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">한정 특가</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">7월 한정 얼리버드 특별 할인</h2>
                <p className="text-white/80 text-lg mb-8">다음달 출발하는 모든 패키지 상품을 최대 30% 할인된 가격으로 만나보세요. 오직 이번 주말까지만 진행됩니다.</p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-purple-700 font-bold px-6 py-3 rounded-lg hover:bg-purple-50 transition duration-300">
                    할인 상품 보기
                  </button>
                  <button className="border border-white/50 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition duration-300">
                    자세히 알아보기
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-sm">
                  <div className="text-white text-5xl font-bold mb-4">30%</div>
                  <div className="text-white/80 mb-4">최대 할인율</div>
                  
                  <div className="bg-white/20 h-px my-6"></div>
                  
                  <div className="text-white font-bold text-xl mb-1">얼리버드 할인 종료까지</div>
                  <div className="flex justify-center gap-3 text-white mb-6">
                    <div className="bg-white/10 rounded-lg p-2 w-16">
                      <div className="text-2xl font-bold">2</div>
                      <div className="text-xs text-white/70">일</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 w-16">
                      <div className="text-2xl font-bold">08</div>
                      <div className="text-xs text-white/70">시간</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 w-16">
                      <div className="text-2xl font-bold">45</div>
                      <div className="text-xs text-white/70">분</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white text-purple-700 font-bold py-3 rounded-lg hover:bg-purple-50 transition duration-300">
                    지금 예약하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 고객 리뷰 섹션 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">여행자들의 생생한 후기</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">K-Travel을 선택한 고객들의 실제 경험을 확인해보세요</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "김지연",
                location: "파리 5일 여행",
                avatar: "/images/avatar-1.jpg",
                text: "처음으로 해외여행을 K-Travel과 함께했는데, 정말 모든 것이 완벽했어요! 가이드님도 친절하고 일정도 여유있게 잡혀있어서 정말 즐거운 여행이었습니다."
              },
              {
                name: "이준호",
                location: "바르셀로나 자유여행",
                avatar: "/images/avatar-2.jpg",
                text: "자유여행이라 걱정했는데, K-Travel의 현지 서포트가 정말 좋았습니다. 위급상황에서 빠른 대응과 친절한 안내로 안전하게 여행할 수 있었어요."
              },
              {
                name: "박서연",
                location: "제주도 3일 패키지",
                avatar: "/images/avatar-3.jpg",
                text: "아이들과 함께하는 여행이라 걱정했는데, 아이들을 위한 특별 프로그램까지 준비해주셔서 아이들도 저도 너무 즐거웠습니다. 다음에도 꼭 이용할게요!"
              }
            ].map((review, index) => (
              <div key={index} className="bg-neutral-50 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a href="#" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
              모든 후기 보기
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 뉴스레터 섹션 */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">특별한 혜택을 놓치지 마세요</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">뉴스레터를 구독하시고 특별 프로모션과 여행 팁을 받아보세요</p>
          
          <form className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="이메일을 입력하세요" 
              className="flex-1 py-3 px-4 rounded-l-lg focus:outline-none text-gray-800" 
            />
            <button 
              type="submit" 
              className="bg-indigo-800 hover:bg-indigo-900 py-3 px-6 rounded-r-lg font-medium transition duration-300"
            >
              구독하기
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
