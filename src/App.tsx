import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// 어드민 컴포넌트 임포트
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import CategoryManagement from './components/admin/CategoryManagement';

// 어드민 페이지 임포트 (pages/admin 폴더 사용)
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import BookingManagement from './pages/admin/BookingManagement';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Header />}
      <main className={`flex-grow ${isAdminPage ? 'p-0' : ''}`}>
        <Routes>
          {/* 메인 사이트 라우트 */}
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 어드민 라우트 - AdminLayout으로 감싸기 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
