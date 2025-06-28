import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return '대시보드';
      case '/admin/users':
        return '회원 관리';
      case '/admin/products':
        return '상품 관리';
      case '/admin/bookings':
        return '예약 관리';
      case '/admin/menus':
        return '메뉴 관리';
      case '/admin/categories':
        return '카테고리 관리';
      case '/admin/footer':
        return '푸터 정보 관리';
      default:
        return 'K-Travel 관리자';
    }
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <li>
        <Link
          to={to}
          className={`block p-4 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
        >
          {children}
        </Link>
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
        <div className="p-4 text-2xl font-bold">K-Travel Admin</div>
        <nav className="flex-grow">
          <ul>
            <NavLink to="/admin">대시보드</NavLink>
            <NavLink to="/admin/users">회원 관리</NavLink>
            <NavLink to="/admin/products">상품 관리</NavLink>
            <NavLink to="/admin/bookings">예약 관리</NavLink>
            <NavLink to="/admin/menus">메뉴 관리</NavLink>
            <NavLink to="/admin/categories">카테고리 관리</NavLink>
            <NavLink to="/admin/footer">푸터 정보</NavLink>
          </ul>
        </nav>
        <div>
          <ul>
            <li>
              <Link to="/" className="block p-4 hover:bg-gray-700">
                사이트로 돌아가기
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <span>관리자님, 환영합니다.</span>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
