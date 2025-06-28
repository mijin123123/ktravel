// src/pages/Packages.tsx

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TravelPackage, MenuCategory } from '../types';
import { supabase } from '../lib/supabaseClient';

const Packages = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();

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
      const { data, error } = await supabase.from('menu').select('*');
      if (error) {
        console.error('Error fetching menu:', error);
      } else {
        setMenuItems(data || []);
      }
    };
    fetchMenu();
  }, []);

  // Fetch packages based on URL parameters and subscribe to realtime changes
  useEffect(() => {
    const fetchPackagesByCategory = async () => {
      if (menuItems.length === 0) {
        if (category) {
          setPageTitle('메뉴 로딩 중...');
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let query = supabase.from('products').select('*');
        let title = '전체 여행 상품';
        let performQuery = true;

        if (category) {
          const categoryLower = category.toLowerCase();
          const subcategoryLower = subcategory?.toLowerCase();
          const urlPath = ('/' + [category, subcategory].filter(Boolean).join('/')).toLowerCase();

          let matchedCategory = menuItems.find((m: MenuCategory) => m.url && m.url.toLowerCase() === urlPath);

          if (!matchedCategory) {
            const lastUrlSegment = subcategoryLower || categoryLower;
            const potentialMatches = menuItems.filter((m: MenuCategory) => {
                if (!m.url) return false;
                const menuUrl = m.url.toLowerCase().replace(/\/$/, '');
                const lastMenuSegment = menuUrl.substring(menuUrl.lastIndexOf('/') + 1);
                return lastMenuSegment === lastUrlSegment;
            });

            if (potentialMatches.length === 1) {
                matchedCategory = potentialMatches[0];
            } else if (potentialMatches.length > 1) {
                console.warn(`'${lastUrlSegment}'에 대한 모호한 메뉴 경로가 존재합니다. 첫 번째 항목을 사용합니다.`);
                matchedCategory = potentialMatches[0];
            }
          }

          if (matchedCategory) {
            const parentForTitle = matchedCategory.parent_id 
              ? menuItems.find((m: MenuCategory) => m.id === matchedCategory!.parent_id)
              : undefined;

            title = parentForTitle 
                ? `${parentForTitle.name} > ${matchedCategory.name}` 
                : matchedCategory.name;

            const children = menuItems.filter((m: MenuCategory) => m.parent_id === matchedCategory!.id);
            if (children.length > 0) {
              const childCategoryNames = children.map((c: MenuCategory) => c.name);
              query = query.in('category', childCategoryNames);
            } else {
              query = query.eq('category', matchedCategory.name);
            }
          } else {
            performQuery = false;
            setError(`'${subcategory || category}' 카테고리 정보를 찾을 수 없습니다.`);
            setAllPackages([]);
          }
        }
        
        setPageTitle(title);

        if (performQuery) {
          const { data, error: queryError } = await query.order('created_at', { ascending: false });
          if (queryError) throw queryError;
          setAllPackages(data || []);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        console.error("상품 정보 로딩 실패:", errorMessage);
        setError('상품 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackagesByCategory();

    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('상품 테이블 변경 감지! 재조회합니다.', payload);
          fetchPackagesByCategory(); // 데이터가 변경되면 상품 목록을 다시 불러옵니다.
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category, subcategory, menuItems]);

  // Apply user sorting
  useEffect(() => {
    let result: TravelPackage[] = [...allPackages];

    if (sortBy === 'priceLow') {
      result.sort((a, b) => (a.price * (1 - a.discountRate)) - (b.price * (1 - b.discountRate)));
    } else if (sortBy === 'priceHigh') {
      result.sort((a, b) => (b.price * (1 - b.discountRate)) - (a.price * (1 - a.discountRate)));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredPackages(result);
  }, [sortBy, allPackages]);


  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">페이지 로딩 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">오류: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{pageTitle}</h1>
      
      {/* Sort Controls */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8 flex justify-end">
        <select value={sortBy} onChange={handleSortChange} className="p-2 border rounded">
          <option value="recommended">추천순</option>
          <option value="priceLow">가격 낮은순</option>
          <option value="priceHigh">가격 높은순</option>
          <option value="rating">평점 높은순</option>
        </select>
      </div>

      {/* Package List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link to={`/package/${pkg.id}`}>
                <img src={pkg.image || 'https://via.placeholder.com/400x300'} alt={pkg.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold">{pkg.name}</h2>
                  <p className="text-gray-600">{pkg.destination}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">{'★'.repeat(Math.round(pkg.rating))}{'☆'.repeat(5 - Math.round(pkg.rating))}</span>
                    <span className="ml-2 text-sm text-gray-500">({pkg.rating.toFixed(1)})</span>
                  </div>
                  <div className="mt-4">
                    {pkg.discountRate > 0 && (
                      <span className="text-gray-500 line-through mr-2">
                        {(pkg.price || 0).toLocaleString()}원
                      </span>
                    )}
                    <span className="text-red-500 font-bold text-lg">
                      {((pkg.price || 0) * (1 - (pkg.discountRate || 0))).toLocaleString()}원
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>해당 조건에 맞는 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Packages;