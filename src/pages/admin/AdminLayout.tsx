
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const menuItems = [
    { path: '/admin', name: '대시보드' },
    { path: '/admin/menu', name: '메뉴 관리' },
    { path: '/admin/users', name: '회원 관리' },
    { path: '/admin/bookings', name: '예약 관리' },
    { path: '/admin/products', name: '상품 관리' },
    { path: '/admin/accounts', name: '계좌 관리' },
    { path: '/admin/footer', name: '푸터 수정' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold">K-Travel Admin</div>
        <nav className="flex-grow">
          <ul>
            {menuItems.map(item => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  end={item.path === '/admin'} // 대시보드는 정확히 일치할 때만 active
                  className={({ isActive }) => 
                    `block px-4 py-3 hover:bg-gray-700 ${
                      isActive ? 'bg-blue-600 font-bold' : ''
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-grow p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
