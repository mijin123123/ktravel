// src/pages/Packages.tsx

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TravelPackage, MenuCategory } from '../types';
import { supabase } from '../lib/supabaseClient';

const Packages = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();

  const [filters, setFilters] = useState({
    region: '',
    priceRange: '',
    days: '',
    type: '',
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [allPackages, setAllPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('전체 여행 상품');
  const [menuItems, setMenuItems] = useState<MenuCategory[]>([]);

  // Fetch all menu items once to use for category mapping
  useEffect(() => {
    const fetchMenu = async () => {
      console.log('Fetching menu items...');
      const { data, error } = await supabase.from('menu').select('*');
      
      if (error) {
        console.error('Error fetching menu:', error);
      } else {
        console.log('Menu items fetched:', data?.length || 0);
        setMenuItems(data || []);
      }
    };
    fetchMenu();
  }, []);

  // Fetch packages based on URL parameters
  useEffect(() => {
    const fetchPackagesByCategory = async () => {
      if (menuItems.length === 0) return; // Wait for menu items to be loaded

      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching products with params:', { category, subcategory });
        
        let query = supabase.from('products').select('*');
        let title = '전체 여행 상품';

        const parentCategory = menuItems.find(m => m.url === category && m.parent_id === null);
        const childCategory = menuItems.find(m => m.url === subcategory && m.parent_id !== null);

        console.log('Categories found:', { parentCategory, childCategory });

        if (parentCategory && childCategory) {
          // Subcategory page (e.g., /best/europe)
          query = query.eq('category', childCategory.name);
          title = `${parentCategory.name} > ${childCategory.name}`;
        } else if (parentCategory) {
          // Parent category page (e.g., /best)
          const childCategories = menuItems.filter(m => m.parent_id === parentCategory.id);
          if (childCategories.length > 0) {
            const categoryNames = childCategories.map(c => c.name);
            console.log('Using child categories:', categoryNames);
            query = query.in('category', categoryNames);
          } else {
            // A parent category that is also a product category (e.g., /domestic)
            query = query.eq('category', parentCategory.name);
          }
          title = parentCategory.name;
        }
        
        setPageTitle(title);
        
        console.log('Executing Supabase query...');
        // 먼저 products 테이블 구조 확인 
        const { data: columnsData, error: columnsError } = await supabase
          .from('products')
          .select('*')
          .limit(1);
          
        if (columnsError) {
          console.error('Error checking products table:', columnsError);
        } else if (columnsData && columnsData.length > 0) {
          console.log('Products table columns:', Object.keys(columnsData[0]));
        }
        
        const { data, error: queryError } = await query.order('created_at', { ascending: false });

        if (queryError) {
          console.error('Supabase query error:', queryError);
          throw queryError;
        }
        
        console.log('Products fetched:', data ? data.length : 0);
        setAllPackages(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        console.error("상품 정보 로딩 실패:", errorMessage);
        setError(errorMessage);
        // 임시: 에러 상황에서도 테스트 데이터 표시
        setAllPackages([
          {
            id: '1',
            name: '테스트 상품 (API 연결 오류)',
            price: 1000000,
            discountRate: 0.1,
            rating: 4.5,
            destination: '테스트',
            image: 'https://via.placeholder.com/300x200',
            days: 5,
            type: 'culture',
            description: '테스트 상품입니다. API 연결을 확인해주세요.',
            region: 'test',
            created_at: new Date().toISOString(),
            category: '추천여행'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (menuItems.length > 0) {
        fetchPackagesByCategory();
    } else {
        setPageTitle('상품 로딩 중...');
    }

  }, [category, subcategory, menuItems]);

  // Apply user filters and sorting
  useEffect(() => {
    let result = [...allPackages];

    if (filters.region) {
      result = result.filter((pkg) => pkg.destination.toLowerCase().includes(filters.region));
    }
    if (filters.priceRange) {
      const [minStr, maxStr] = filters.priceRange.split('-');
      const min = Number(minStr);
      const max = maxStr && maxStr !== '' ? Number(maxStr) : null;
      result = result.filter((pkg) => {
        const finalPrice = pkg.price * (1 - pkg.discountRate);
        if (max) {
          return finalPrice >= min && finalPrice <= max;
        }
        return finalPrice >= min;
      });
    }
    if (filters.days) {
        const [minStr, maxStr] = filters.days.split('-');
        const min = Number(minStr);
        const max = maxStr && maxStr !== '' ? Number(maxStr) : null;
        result = result.filter((pkg) => {
          if (max) {
            return pkg.days >= min && pkg.days <= max;
          }
          return pkg.days >= min;
        });
      }
  
      if (filters.type) {
        result = result.filter((pkg) => pkg.type === filters.type);
      }

    if (sortBy === 'priceLow') {
      result.sort((a, b) => (a.price * (1 - a.discountRate)) - (b.price * (1 - b.discountRate)));
    } else if (sortBy === 'priceHigh') {
      result.sort((a, b) => (b.price * (1 - b.discountRate)) - (a.price * (1 - a.discountRate)));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredPackages(result);
  }, [filters, sortBy, allPackages]);


  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const priceRanges = [
    { value: '', label: '모든 가격대' },
    { value: '0-1000000', label: '100만원 이하' },
    { value: '1000000-1500000', label: '100만원 - 150만원' },
    { value: '1500000-2000000', label: '150만원 - 200만원' },
    { value: '2000000-', label: '200만원 이상' },
  ];

  const dayRanges = [
    { value: '', label: '모든 일수' },
    { value: '1-3', label: '1-3일' },
    { value: '4-7', label: '4-7일' },
    { value: '8-', label: '8일 이상' },
  ];

  const packageTypes = [
    { value: '', label: '모든 유형' },
    { value: 'culture', label: '문화 탐방' },
    { value: 'beach', label: '휴양/해변' },
    { value: 'city', label: '도시 여행' },
    { value: 'honeymoon', label: '허니문' },
  ];

  const regions = [
    { value: '', label: '모든 지역' },
    { value: 'europe', label: '유럽' },
    { value: 'asia', label: '아시아' },
    { value: 'oceania', label: '오세아니아' },
    { value: 'america', label: '미주/중남미' },
  ];

  return (
    <div className="container-custom">
      <div className="bg-gray-200 h-48 flex items-center justify-center my-8">
        <h1 className="text-4xl font-bold">{pageTitle}</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
          <select name="region" value={filters.region} onChange={handleFilterChange} className="p-2 border rounded-md">
            {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange} className="p-2 border rounded-md">
            {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select name="days" value={filters.days} onChange={handleFilterChange} className="p-2 border rounded-md">
            {dayRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 border rounded-md">
            {packageTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="mt-4 md:mt-0">
          <select value={sortBy} onChange={handleSortChange} className="p-2 border rounded-md">
            <option value="recommended">추천순</option>
            <option value="priceLow">가격 낮은순</option>
            <option value="priceHigh">가격 높은순</option>
            <option value="rating">평점 높은순</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg">상품 목록을 불러오는 중입니다...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>오류가 발생했습니다: {error}</p>
        </div>
      ) : filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <Link to={`/product/${pkg.id}`} key={pkg.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">{pkg.destination}</p>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span className="text-sm">{pkg.rating.toFixed(1)}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 truncate">{pkg.name}</h3>
                <div className="flex justify-end items-center">
                  {pkg.discountRate > 0 && (
                    <span className="text-red-500 font-bold text-lg mr-2">
                      {Math.round(pkg.discountRate * 100)}%
                    </span>
                  )}
                  <span className="text-gray-900 font-bold text-xl">
                    {(pkg.price * (1 - pkg.discountRate)).toLocaleString()}원
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">해당 카테고리의 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default Packages;