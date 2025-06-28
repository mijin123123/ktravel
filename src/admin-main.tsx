import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import BookingManagement from './pages/admin/BookingManagement';
import MenuManagement from './pages/admin/MenuManagement';
import FooterManagement from './pages/admin/FooterManagement';
import './index.css';

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/bookings" element={<BookingManagement />} />
      <Route path="/menus" element={<MenuManagement />} />
      <Route path="/footer" element={<FooterManagement />} />
    </Routes>
  </AdminLayout>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/admin">
      <AdminRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
