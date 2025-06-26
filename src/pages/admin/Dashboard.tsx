import React, { useState, useEffect } from 'react';
import { TravelPackage, User, Booking, BookingStatus } from '../../types';

interface DashboardData {
  totalProducts: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes, bookingsRes] = await Promise.all([
          fetch('/products.json'),
          fetch('/users.json'),
          fetch('/bookings.json')
        ]);

        if (!productsRes.ok || !usersRes.ok || !bookingsRes.ok) {
          throw new Error('대시보드 데이터를 불러오는 데 실패했습니다.');
        }

        const products: TravelPackage[] = await productsRes.json();
        const users: User[] = await usersRes.json();
        const bookings: Booking[] = await bookingsRes.json();

        const totalRevenue = bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + b.totalPrice, 0);

        const recentBookings = [...bookings]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setDashboardData({
          totalProducts: products.length,
          totalUsers: users.length,
          totalBookings: bookings.length,
          totalRevenue,
          recentBookings
        });

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadgeColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-200 text-blue-800';
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'canceled': return 'bg-red-200 text-red-800';
      case 'completed': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="p-6 animate-pulse">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">에러: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="p-6">표시할 데이터가 없습니다.</div>;
  }

  const { totalProducts, totalUsers, totalBookings, totalRevenue, recentBookings } = dashboardData;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
          <h2 className="text-lg font-semibold text-gray-500 mb-2">총 상품 수</h2>
          <p className="text-4xl font-bold text-blue-600">{totalProducts}개</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
          <h2 className="text-lg font-semibold text-gray-500 mb-2">총 회원 수</h2>
          <p className="text-4xl font-bold text-green-600">{totalUsers}명</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
          <h2 className="text-lg font-semibold text-gray-500 mb-2">총 예약 건수</h2>
          <p className="text-4xl font-bold text-yellow-600">{totalBookings}건</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
          <h2 className="text-lg font-semibold text-gray-500 mb-2">총 매출액</h2>
          <p className="text-3xl font-bold text-red-600">{totalRevenue.toLocaleString()}원</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 p-6 border-b">최근 예약 현황 (최신 5건)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">예약 ID</th>
                <th className="py-3 px-6 text-left">사용자 ID</th>
                <th className="py-3 px-6 text-left">상품 ID</th>
                <th className="py-3 px-6 text-right">가격</th>
                <th className="py-3 px-6 text-center">상태</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left font-mono text-xs">{booking.id}</td>
                  <td className="py-3 px-6 text-left font-mono text-xs">{booking.userId}</td>
                  <td className="py-3 px-6 text-left font-mono text-xs">{booking.packageId}</td>
                  <td className="py-3 px-6 text-right">{booking.totalPrice.toLocaleString()}원</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full ${getStatusBadgeColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
