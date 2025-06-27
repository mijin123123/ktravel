
// src/pages/AdminLayout.tsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-8">K-Travel Admin</h2>
        <nav>
          <ul>
            <li className="mb-4"><Link to="/admin" className="hover:text-gray-300">대시보드</Link></li>
            <li className="mb-4"><Link to="/admin/products" className="hover:text-gray-300">상품 관리</Link></li>
            <li className="mb-4"><Link to="/admin/users" className="hover:text-gray-300">회원 관리</Link></li>
            <li className="mb-4"><Link to="/admin/bookings" className="hover:text-gray-300">예약 관리</Link></li>
            <li className="mb-4"><Link to="/admin/account" className="hover:text-gray-300">계좌 관리</Link></li>
            <li className="mb-4"><Link to="/admin/footer" className="hover:text-gray-300">푸터 관리</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
