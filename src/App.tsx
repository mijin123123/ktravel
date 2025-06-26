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
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
