import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { menu, loading, error } = useMenu();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-800 font-serif">TRIP STORE</span>
            </Link>
          </div>
          
          {/* 데스크탑 네비게이션 */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {loading && <p>Loading...</p>}
              {error && <p>Error loading menu</p>}
              {menu.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* 검색창 */}
          <div className="hidden md:flex items-center ml-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="도시나 상품을 검색해보세요" 
                className="w-64 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
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
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.href)
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
