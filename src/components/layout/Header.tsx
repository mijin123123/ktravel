import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuCategory } from '../../types'; // 타입 가져오기

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const location = useLocation();
  
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`/menu.json?t=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: MenuCategory[] = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error("Failed to fetch menu.json:", error);
        // 에러 발생 시 빈 배열로 설정
        setMenuData([]);
      }
    };

    fetchMenuData();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 font-serif">TRIP STORE</span>
            </Link>
          </div>
          
          {/* 데스크탑 네비게이션 */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuData.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.url)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
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
            <Link
              key={item.name}
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
