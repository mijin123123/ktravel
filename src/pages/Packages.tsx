import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 여행 패키지 타입 정의
interface Package {
  id: string;
  name: string;
  destination: string;
  region: string;
  image: string;
  price: number;
  days: number;
  description: string;
  rating: number;
  type: string;
}

const Packages = () => {
  // 필터 상태
  const [filters, setFilters] = useState({
    region: '',
    priceRange: '',
    days: '',
    type: ''
  });
  
  // 정렬 상태
  const [sortBy, setSortBy] = useState('recommended');
  
  // 패키지 데이터 (실제로는 API에서 가져올 데이터)
  const [packages, setPackages] = useState<Package[]>([
    {
      id: '1',
      name: '로마, 피렌체, 베니스를 아우르는 이탈리아 핵심 투어',
      destination: '이탈리아',
      region: 'europe',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      price: 1290000,
      days: 7,
      description: '영원한 도시 로마에서의 특별한 여행. 콜로세움, 바티칸, 트레비 분수 등 고대 유적 탐험과 함께 피렌체의 예술, 베니스의 운하를 모두 경험하세요.',
      rating: 4.8,
      type: 'culture'
    },
    {
      id: '2',
      name: '도쿄 시티 투어 - 현대와 전통이 공존하는 일본의 수도',
      destination: '일본',
      region: 'asia',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHRva3lvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      price: 980000,
      days: 5,
      description: '전통과 현대가 공존하는 도쿄. 신주쿠, 시부야, 아사쿠사 등 일본 문화 체험.',
      rating: 4.9,
      type: 'city'
    },
    {
      id: '3',
      name: '파리 & 프로방스 로맨틱 여행',
      destination: '프랑스',
      region: 'europe',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80',
      price: 1490000,
      days: 6,
      description: '낭만의 도시 파리에서의 환상적인 여행. 에펠탑, 루브르 박물관, 개선문, 노트르담 대성당 관광과 함께 프로방스의 라벤더 밭을 경험하세요.',
      rating: 4.7,
      type: 'romantic'
    },
    {
      id: '4',
      name: '발리 허니문 특별 패키지',
      destination: '인도네시아',
      region: 'asia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1938&q=80',
      price: 890000,
      days: 5,
      description: '신들의 섬 발리에서 즐기는 완벽한 허니문. 아름다운 해변과 우붓의 계단식 논 탐방, 프라이빗 풀빌라 숙박 포함.',
      rating: 4.9,
      type: 'honeymoon'
    },
    {
      id: '5',
      name: '시드니 & 골드코스트 오스트레일리아 핵심 투어',
      destination: '호주',
      region: 'oceania',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      price: 1690000,
      days: 8,
      description: '시드니의 오페라 하우스, 하버 브릿지부터 골드코스트의 아름다운 해변까지 호주의 핵심 명소를 모두 경험하세요.',
      rating: 4.6,
      type: 'sightseeing'
    },
    {
      id: '6',
      name: '뉴욕 & 워싱턴 D.C. 미동부 핵심 투어',
      destination: '미국',
      region: 'america',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      price: 1790000,
      days: 7,
      description: '세계의 수도 뉴욕에서 자유의 여신상, 타임스퀘어, 브로드웨이를 경험하고 미국의 수도 워싱턴 D.C.에서 백악관과 국회의사당을 방문하세요.',
      rating: 4.5,
      type: 'city'
    },
    {
      id: '7',
      name: '방콕 & 푸켓 태국 여행',
      destination: '태국',
      region: 'asia',
      image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      price: 750000,
      days: 6,
      description: '활기찬 방콕의 사원과 시장을 탐험하고, 푸켓의 에메랄드 해변에서 휴양을 즐기세요.',
      rating: 4.7,
      type: 'beach'
    },
    {
      id: '8',
      name: '바르셀로나 & 마드리드 스페인 문화 탐방',
      destination: '스페인',
      region: 'europe',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      price: 1250000,
      days: 7,
      description: '가우디의 도시 바르셀로나와 왕족의 도시 마드리드를 아우르는 스페인 문화 탐방 여행입니다.',
      rating: 4.8,
      type: 'culture'
    }
  ]);
  
  // 필터링된 패키지
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  
  // 가격 범위 옵션
  const priceRanges = [
    { value: '', label: '모든 가격대' },
    { value: '0-1000000', label: '100만원 이하' },
    { value: '1000000-1500000', label: '100만원 - 150만원' },
    { value: '1500000-2000000', label: '150만원 - 200만원' },
    { value: '2000000-', label: '200만원 이상' },
  ];
  
  // 여행 일수 옵션
  const dayRanges = [
    { value: '', label: '모든 일수' },
    { value: '1-3', label: '1-3일' },
    { value: '4-7', label: '4-7일' },
    { value: '8-', label: '8일 이상' },
  ];
  
  // 여행 유형 옵션
  const packageTypes = [
    { value: '', label: '모든 유형' },
    { value: 'culture', label: '문화 탐방' },
    { value: 'beach', label: '휴양/해변' },
    { value: 'city', label: '도시 여행' },
    { value: 'honeymoon', label: '허니문' },
    { value: 'romantic', label: '로맨틱' },
    { value: 'sightseeing', label: '관광' },
  ];
  
  // 지역 옵션
  const regions = [
    { value: '', label: '모든 지역' },
    { value: 'europe', label: '유럽' },
    { value: 'asia', label: '아시아' },
    { value: 'oceania', label: '오세아니아' },
    { value: 'america', label: '미주/중남미' },
  ];
  
  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  
  // 정렬 변경 핸들러
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  // 필터링 및 정렬 로직
  useEffect(() => {
    let result = [...packages];
    
    // 지역 필터링
    if (filters.region) {
      result = result.filter(pkg => pkg.region === filters.region);
    }
    
    // 가격 범위 필터링
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(pkg => {
        if (!max) return pkg.price >= min;
        return pkg.price >= min && pkg.price <= max;
      });
    }
    
    // 일수 필터링
    if (filters.days) {
      const [min, max] = filters.days.split('-').map(Number);
      result = result.filter(pkg => {
        if (!max) return pkg.days >= min;
        return pkg.days >= min && pkg.days <= max;
      });
    }
    
    // 유형 필터링
    if (filters.type) {
      result = result.filter(pkg => pkg.type === filters.type);
    }
    
    // 정렬
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'duration-short':
        result.sort((a, b) => a.days - b.days);
        break;
      case 'duration-long':
        result.sort((a, b) => b.days - a.days);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        // 기본 정렬은 추천 순(여기서는 임의로 설정)
        break;
    }
    
    setFilteredPackages(result);
  }, [filters, sortBy, packages]);
  
  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">여행 패키지</h1>
          <p className="text-gray-600">TRIP STORE가 제공하는 다양한 해외여행 패키지입니다.</p>
        </div>
        
        {/* 필터 및 정렬 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* 지역 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
              <select
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {regions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* 가격 범위 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격 범위</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {priceRanges.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* 일수 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">여행 일수</label>
              <select
                name="days"
                value={filters.days}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {dayRanges.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* 유형 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">여행 유형</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {packageTypes.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* 정렬 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">정렬</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="recommended">추천순</option>
                <option value="price-low">가격 낮은순</option>
                <option value="price-high">가격 높은순</option>
                <option value="duration-short">짧은 일정순</option>
                <option value="duration-long">긴 일정순</option>
                <option value="rating">평점순</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* 검색 결과 */}
        <div className="mb-4">
          <p className="text-gray-600">총 {filteredPackages.length}개의 패키지</p>
        </div>
        
        {/* 패키지 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Link to={`/packages/${pkg.id}`}>
                <div className="relative h-56">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  {/* 지역 뱃지 */}
                  <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {regions.find(r => r.value === pkg.region)?.label}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      <span>{'★'.repeat(Math.floor(pkg.rating))}</span>
                      <span className="text-gray-300">{'★'.repeat(5-Math.floor(pkg.rating))}</span>
                    </div>
                    <span className="ml-1 text-sm text-gray-600">{pkg.rating.toFixed(1)}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">{pkg.days}일 여행</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{pkg.destination}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">1인 기준</span>
                      <span className="font-bold text-lg text-primary-600">{formatPrice(pkg.price)}원~</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* 패키지가 없을 경우 */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-6">다른 검색 조건을 시도해보세요.</p>
            <button
              onClick={() => setFilters({ region: '', priceRange: '', days: '', type: '' })}
              className="btn btn-primary"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
