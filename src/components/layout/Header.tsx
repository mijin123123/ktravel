import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuCategory } from '../../types';
import { supabase } from '../../lib/supabaseClient';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const { data, error } = await supabase
          .from('menu')
          .select('*')
          .order('order', { ascending: true });

        if (error) throw error;

        // Supabase에서 가져온 평면 데이터를 계층 구조로 가공
        const topLevelMenus = data.filter(item => item.parent_id === null);
        const subMenus = data.filter(item => item.parent_id !== null);

        const hierarchicalMenu = topLevelMenus.map(menu => ({
          ...menu,
          sub: subMenus.filter(subMenu => subMenu.parent_id === menu.id)
                       .sort((a, b) => a.order - b.order),
        }));

        setMenuData(hierarchicalMenu);
      } catch (error) {
        console.error("메뉴 데이터 로딩 실패:", error);
        setMenuData([]);
      }
    };

    fetchMenuData();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 font-serif">TRIP STORE</span>
            </Link>
          </div>
          
          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuData.map((item) => (
                <div 
                  key={item.id} 
                  className="relative"
                  onMouseEnter={() => item.sub && item.sub.length > 0 && setActiveMenu(item.id)}
                  onMouseLeave={() => item.sub && item.sub.length > 0 && setActiveMenu(null)}
                >
                  <Link
                    to={item.url}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.url)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                  {item.sub && item.sub.length > 0 && activeMenu === item.id && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                      {item.sub.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.url}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
          
          {/* 로그인/회원가입 버튼 */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/login" className="btn btn-secondary">
              로그인
            </Link>
            <Link to="/register" className="btn btn-primary">
              회원가입
            </Link>
          </div>
          
          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">메뉴 열기</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuData.map((item) => (
            <div key={item.id} className="relative">
              <Link
                to={item.url}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.url)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
              {item.sub && item.sub.length > 0 && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.sub.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.url}
                      className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <Link to="/login" className="block w-full mb-2 btn btn-secondary">
                로그인
              </Link>
              <Link to="/register" className="block w-full btn btn-primary">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
