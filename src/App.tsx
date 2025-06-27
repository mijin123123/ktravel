import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminMenu from './pages/admin/AdminMenu'
import ManageUsers from './pages/admin/ManageUsers'
import ManageBookings from './pages/admin/ManageBookings'
import ManageProducts from './pages/admin/ManageProducts'
import ManageAccounts from './pages/admin/ManageAccounts'
import EditFooter from './pages/admin/EditFooter'

// 일반 사용자용 레이아웃
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
)

function App() {
  return (
    <Routes>
      {/* --- 일반 사용자 페이지 --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        {/* 정적 페이지 (동적 라우트보다 항상 위에 있어야 합니다) */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 상품 관련 페이지 */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/product/:id" element={<PackageDetail />} />

        {/* 동적 카테고리 라우트 */}
        {/* /best, /domestic, /best/europe 같은 모든 카테고리/서브카테고리 경로를 처리합니다. */}
        {/* 다른 정적 경로와 충돌하지 않도록 가장 마지막에 배치합니다. */}
        <Route path="/:category" element={<Packages />} />
        <Route path="/:category/:subcategory" element={<Packages />} />
      </Route>

      {/* --- 관리자 페이지 --- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="accounts" element={<ManageAccounts />} />
        <Route path="footer" element={<EditFooter />} />
      </Route>

      {/* --- 404 페이지 --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
