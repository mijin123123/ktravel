import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// 상세 여행 패키지 타입
interface PackageDetail {
  id: string;
  name: string;
  destination: string;
  region: string;
  images: string[];
  price: number;
  days: number;
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals: string[];
    accommodation: string;
  }[];
  rating: number;
  reviews: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  
  console.log('Package ID:', id);
  
  // 실제 앱에서는 ID를 기반으로 API에서 데이터를 가져옵니다
  // 여기서는 샘플 데이터를 사용합니다
  const packageData: PackageDetail = {
    id: '1',
    name: '로마, 피렌체, 베니스를 아우르는 이탈리아 핵심 투어',
    destination: '이탈리아',
    region: 'europe',
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80'
    ],
    price: 1290000,
    days: 7,
    description: '이탈리아의 대표적인 세 도시를 아우르는 알찬 여행 패키지입니다. 영원한 도시 로마에서는 콜로세움, 바티칸 시국, 트레비 분수 등 고대 로마 제국의 유적을 탐험하고, 르네상스의 중심지 피렌체에서는 두오모 성당과 우피치 미술관을 방문합니다. 물의 도시 베니스에서는 곤돌라를 타고 운하를 돌아보는 시간을 가집니다. 이탈리아 특유의 분위기와 문화, 미식을 모두 경험할 수 있는 완벽한 여행입니다.',
    highlights: [
      '고대 로마의 상징 콜로세움 입장 및 가이드 투어',
      '바티칸 박물관과 시스티나 성당 우선 입장권',
      '피렌체 두오모 성당과 우피치 미술관 관람',
      '베니스 곤돌라 투어 포함',
      '현지 전문 가이드의 역사 및 문화 해설',
      '모든 도시 간 이동은 고급 전용 차량으로 제공'
    ],
    included: [
      '왕복 국제선 항공권',
      '공항-호텔 간 전용 차량 송영',
      '4성급 호텔 숙박(2인 1실 기준)',
      '전 일정 조식 및 지정된 식사',
      '전문 현지 가이드 및 인솔자 서비스',
      '여행자 보험',
      '입장료 및 관광 요금'
    ],
    excluded: [
      '개인 여행 경비',
      '가이드/기사 팁',
      '선택 관광 비용',
      '식사 시 음료수'
    ],
    itinerary: [
      {
        day: 1,
        title: '인천 출발 - 로마 도착',
        description: '인천공항에서 출발하여 로마 피우미치노 공항에 도착합니다. 전용 차량으로 호텔로 이동하여 체크인 후 휴식을 취합니다.',
        meals: ['기내식', '석식'],
        accommodation: '로마 4성급 호텔'
      },
      {
        day: 2,
        title: '로마 관광 (바티칸 시국, 성 베드로 대성당)',
        description: '아침 식사 후 바티칸 시국을 방문합니다. 바티칸 박물관, 시스티나 성당, 성 베드로 대성당을 관람합니다. 오후에는 스페인 광장과 트레비 분수를 방문합니다.',
        meals: ['조식', '중식', '석식'],
        accommodation: '로마 4성급 호텔'
      },
      {
        day: 3,
        title: '로마 관광 (콜로세움, 로마 포럼)',
        description: '아침 식사 후 고대 로마의 상징인 콜로세움과 로마 포럼을 방문합니다. 오후에는 판테온과 나보나 광장을 관람합니다.',
        meals: ['조식', '중식', '석식'],
        accommodation: '로마 4성급 호텔'
      },
      {
        day: 4,
        title: '로마 - 피렌체',
        description: '아침 식사 후 전용 차량으로 피렌체로 이동합니다. 도착 후 두오모 성당과 우피치 미술관을 관람합니다.',
        meals: ['조식', '중식', '석식'],
        accommodation: '피렌체 4성급 호텔'
      },
      {
        day: 5,
        title: '피렌체 - 베니스',
        description: '아침 식사 후 전용 차량으로 베니스로 이동합니다. 도착 후 산 마르코 광장과 산 마르코 대성당을 방문합니다.',
        meals: ['조식', '중식', '석식'],
        accommodation: '베니스 4성급 호텔'
      },
      {
        day: 6,
        title: '베니스 관광',
        description: '아침 식사 후 곤돌라를 타고 베니스 운하를 돌아봅니다. 리알토 다리와 명품 거리를 관람합니다.',
        meals: ['조식', '중식', '석식'],
        accommodation: '베니스 4성급 호텔'
      },
      {
        day: 7,
        title: '베니스 - 인천',
        description: '아침 식사 후 공항으로 이동하여 인천행 비행기에 탑승합니다.',
        meals: ['조식', '기내식'],
        accommodation: '기내'
      }
    ],
    rating: 4.8,
    reviews: [
      {
        id: '1',
        name: '김민수',
        rating: 5,
        comment: '가이드님이 정말 친절하고 전문적이셨어요. 숙소나 식사도 모두 만족스러웠고, 일정도 여유롭게 잘 짜여져 있어서 정말 즐거운 여행이 됐습니다. 특히 로마와 베니스 투어가 인상적이었습니다.',
        date: '2024-05-15'
      },
      {
        id: '2',
        name: '이지연',
        rating: 4,
        comment: '전반적으로 좋았지만, 피렌체에서의 일정이 조금 빡빡했어요. 그래도 이탈리아의 아름다움을 충분히 느낄 수 있었고 특히 음식이 정말 맛있었습니다.',
        date: '2024-04-22'
      },
      {
        id: '3',
        name: '박준호',
        rating: 5,
        comment: '처음 해외여행이라 걱정했는데, 인솔자분이 세심하게 케어해주셔서 정말 감사했습니다. 특히 베니스 곤돌라 투어는 평생 잊지 못할 추억이 되었어요!',
        date: '2024-03-10'
      }
    ]
  };
  
  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // 총 가격 계산
  const totalPrice = packageData.price * travelers;
  
  // 이용 가능한 날짜 (실제로는 API에서 받아와야 함)
  const availableDates = [
    '2025-07-15',
    '2025-08-05',
    '2025-08-20',
    '2025-09-10',
    '2025-10-05'
  ];
  
  // 별점 컴포넌트
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex text-yellow-400">
        <span>{'★'.repeat(Math.floor(rating))}</span>
        <span className="text-gray-300">{'★'.repeat(5-Math.floor(rating))}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* 상품명 및 기본 정보 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{packageData.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <StarRating rating={packageData.rating} />
              <span className="ml-1 text-sm text-gray-600">{packageData.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{packageData.destination}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{packageData.days}일 여행</span>
          </div>
        </div>
        
        {/* 이미지 갤러리 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-2 row-span-2">
            <img src={packageData.images[0]} alt={packageData.name} className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <img src={packageData.images[1]} alt={`${packageData.name} 이미지 2`} className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <img src={packageData.images[2]} alt={`${packageData.name} 이미지 3`} className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <img src={packageData.images[3]} alt={`${packageData.name} 이미지 4`} className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="relative">
            <img src={packageData.images[0]} alt={`${packageData.name} 이미지 5`} className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <button className="text-white font-medium">더 보기</button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 콘텐츠 영역 */}
          <div className="lg:col-span-2">
            {/* 탭 네비게이션 */}
            <div className="bg-white rounded-t-lg shadow-sm mb-1">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  개요
                </button>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'itinerary' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  일정
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'details' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  포함/불포함
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  후기
                </button>
              </nav>
            </div>
            
            {/* 탭 내용 */}
            <div className="bg-white rounded-b-lg shadow-sm p-6 mb-8">
              {/* 개요 탭 */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">상품 소개</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {packageData.description}
                  </p>
                  
                  <h3 className="text-lg font-bold mb-3">주요 특징</h3>
                  <ul className="mb-6 space-y-2">
                    {packageData.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary-500 mr-2">✓</span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* 일정 탭 */}
              {activeTab === 'itinerary' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">상세 일정</h2>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day, idx) => (
                      <div key={idx} className="border-l-2 border-primary-500 pl-4 pb-6">
                        <h3 className="text-lg font-bold mb-2">Day {day.day}: {day.title}</h3>
                        <p className="text-gray-700 mb-3">{day.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">식사:</span> {day.meals.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">숙소:</span> {day.accommodation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 포함/불포함 탭 */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">포함 사항</h2>
                    <ul className="space-y-2">
                      {packageData.included.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold mb-4">불포함 사항</h2>
                    <ul className="space-y-2">
                      {packageData.excluded.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* 후기 탭 */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">고객 후기</h2>
                    <span className="bg-primary-50 text-primary-700 font-bold px-3 py-1 rounded-full text-sm">
                      평점 {packageData.rating.toFixed(1)}/5
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {packageData.reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold">{review.name}</h3>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <div className="mb-2">
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <button className="btn btn-secondary w-full">후기 작성하기</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 오른쪽 예약 카드 */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">예약하기</h3>
                <p className="text-primary-600 font-bold text-2xl">{formatPrice(packageData.price)}원~</p>
                <p className="text-sm text-gray-500">1인 기준 가격</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">출발일 선택</label>
                  <select
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">출발일을 선택하세요</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">인원</label>
                  <div className="flex items-center">
                    <button
                      onClick={() => travelers > 1 && setTravelers(travelers - 1)}
                      className="px-3 py-2 bg-gray-100 rounded-l-md border border-gray-300"
                      disabled={travelers <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={travelers}
                      readOnly
                      className="w-full px-3 py-2 border-t border-b border-gray-300 text-center"
                    />
                    <button
                      onClick={() => setTravelers(travelers + 1)}
                      className="px-3 py-2 bg-gray-100 rounded-r-md border border-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">상품 가격</span>
                  <span className="font-medium">{formatPrice(packageData.price)}원 x {travelers}인</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700">세금 및 기타 비용</span>
                  <span className="font-medium">포함</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="font-bold">총 예약금</span>
                  <span className="font-bold text-xl text-primary-600">{formatPrice(totalPrice)}원</span>
                </div>
              </div>
              
              <button
                className="w-full mt-6 btn btn-primary py-3 text-base"
                disabled={!selectedDate}
              >
                예약하기
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">예약금 20% 선결제, 잔금은 출발 1개월 전 결제</p>
              </div>
              
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-500">취소 환불</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs text-gray-500">안전 결제</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-500">24시간 지원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 문의하기 섹션 */}
        <div className="bg-primary-50 rounded-lg p-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">궁금한 점이 있으신가요?</h3>
              <p className="text-gray-600">TRIP STORE의 전문 상담원이 도와드립니다.</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/contact" className="btn btn-primary">
                문의하기
              </Link>
              <a href="tel:02-123-4567" className="btn btn-secondary">
                전화 상담
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
