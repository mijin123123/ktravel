import { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../../types';

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/bookings.json');
        if (!response.ok) {
          throw new Error('예약 정보를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setBookings(data);
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

    fetchBookings();
  }, []);

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    // TODO: 실제 API 연동 시 서버에 상태 변경 요청 보내기
  };

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
    return <div className="p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">에러: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">예약 관리</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">예약 ID</th>
              <th className="py-3 px-6 text-left">상품 ID</th>
              <th className="py-3 px-6 text-left">사용자 ID</th>
              <th className="py-3 px-6 text-left">출발일</th>
              <th className="py-3 px-6 text-right">총 가격</th>
              <th className="py-3 px-6 text-center">예약 상태</th>
              <th className="py-3 px-6 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap font-mono text-xs">{booking.id}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap font-mono text-xs">{booking.packageId}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap font-mono text-xs">{booking.userId}</td>
                <td className="py-3 px-6 text-left">{booking.departureDate}</td>
                <td className="py-3 px-6 text-right">{booking.totalPrice.toLocaleString()}원</td>
                <td className="py-3 px-6 text-center">
                  <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full ${getStatusBadgeColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                   <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                      className="border border-gray-300 rounded-md p-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="pending">대기</option>
                        <option value="confirmed">확정</option>
                        <option value="canceled">취소</option>
                        <option value="completed">완료</option>
                    </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
