import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TravelPackage } from '../types'; // 타입 임포트
import { supabase } from '../lib/supabaseClient'; // Supabase 클라이언트 임포트

const Packages = () => {
  // 상태 변수들
  const [filters, setFilters] = useState({
    region: '',
    priceRange: '',
    days: '',
    type: ''
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  
  // 데이터 로딩 로직
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          throw error;
        }
        setPackages(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        console.error("상품 정보 로딩 실패:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // 정렬 변경 핸들러
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // 필터링 및 정렬 로직
  useEffect(() => {
    let result = [...packages];

    if (filters.region) {
        // 참고: 현재 products 테이블에는 region 필드가 없습니다. destination으로 대체합니다.
        result = result.filter(pkg => pkg.destination.toLowerCase().includes(filters.region));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(pkg => {
        const finalPrice = pkg.price * (1 - (pkg.discountRate || 0));
        if (isNaN(max)) return finalPrice >= min;
        return finalPrice >= min && finalPrice <= max;
      });
    }

    if (filters.days) {
      const [min, max] = filters.days.split('-').map(Number);
      result = result.filter(pkg => {
        if (isNaN(max)) return pkg.days >= min;
        return pkg.days >= min && pkg.days <= max;
      });
    }

    if (filters.type) {
      result = result.filter(pkg => pkg.category === filters.type);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price * (1 - (a.discountRate || 0))) - (b.price * (1 - (b.discountRate || 0))));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price * (1 - (b.discountRate || 0))) - (a.price * (1 - (a.discountRate || 0))));
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
        // 기본 정렬 (현재는 추가 로직 없음)
        break;
    }

    setFilteredPackages(result);
  }, [filters, sortBy, packages]);

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  if (isLoading) {
    return <div className="container-custom py-8 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="container-custom py-8 text-center text-red-500">에러: {error}</div>;
  }

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
          {filteredPackages.map(pkg => {
            const finalPrice = pkg.price * (1 - (pkg.discountRate || 0));
            return (
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
                    {pkg.destination}
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
                      <div>
                        {(pkg.discountRate || 0) > 0 && (
                          <span className="text-sm text-gray-400 line-through mr-2">{formatPrice(pkg.price)}원</span>
                        )}
                        <span className="text-sm text-gray-500">1인 기준</span>
                      </div>
                      <span className="font-bold text-lg text-primary-600">{formatPrice(finalPrice)}원~</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            )
          })}
        </div>
        
        {/* 패키지가 없을 경우 */}
        {filteredPackages.length === 0 && !isLoading && (
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
