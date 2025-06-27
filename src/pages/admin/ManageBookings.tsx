import { useState, useEffect, useCallback } from 'react';
import { Booking, BookingStatus } from '../../types';
import { supabase } from '../../lib/supabaseClient';

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // products와 users 테이블에서 필요한 정보를 함께 가져옵니다.
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products ( name ),
          users ( name, email )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setBookings(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      console.error("예약 정보 로딩 실패:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // 로컬 상태 업데이트
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '예약 상태 변경 중 오류가 발생했습니다.';
      console.error(errorMessage);
      alert(errorMessage);
    }
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
              <th className="py-3 px-6 text-left">예약상품</th>
              <th className="py-3 px-6 text-left">예약자 정보</th>
              <th className="py-3 px-6 text-left">출발일</th>
              <th className="py-3 px-6 text-right">총 가격</th>
              <th className="py-3 px-6 text-center">예약 상태</th>
              <th className="py-3 px-6 text-center">상태 변경</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left">
                  <div className="font-bold">{booking.products?.name || '(알 수 없음)'}</div>
                  <div className="text-xs text-gray-500 font-mono">ID: {booking.package_id}</div>
                </td>
                <td className="py-3 px-6 text-left">
                  <div>{booking.users?.name || '(알 수 없음)'}</div>
                  <div className="text-xs text-gray-500">{booking.users?.email}</div>
                </td>
                <td className="py-3 px-6 text-left">{new Date(booking.departure_date).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-right">{booking.total_price.toLocaleString()}원</td>
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
