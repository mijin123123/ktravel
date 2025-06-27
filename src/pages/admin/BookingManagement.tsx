// src/pages/admin/BookingManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Booking } from '../../types';

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    // users와 products 테이블에서 필요한 정보를 join하여 가져옵니다.
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users ( full_name, email ),
        products ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      setError('예약 목록을 불러오는데 실패했습니다.');
    } else {
      setBookings(data as Booking[] || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      alert('상태 변경에 실패했습니다: ' + error.message);
    } else {
      alert('상태가 성공적으로 변경되었습니다.');
      fetchBookings();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">예약 관리</h1>
      {isLoading && <p>예약 목록을 불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">예약자</th>
                <th className="py-3 px-6 text-left">상품명</th>
                <th className="py-3 px-6 text-center">예약일</th>
                <th className="py-3 px-6 text-right">총 가격</th>
                <th className="py-3 px-6 text-center">상태</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {bookings.map(booking => (
                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div>{booking.users?.full_name}</div>
                    <div className="text-xs text-gray-500">{booking.users?.email}</div>
                  </td>
                  <td className="py-3 px-6 text-left">{booking.products?.name}</td>
                  <td className="py-3 px-6 text-center">{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-right">{booking.total_price.toLocaleString()}원</td>
                  <td className="py-3 px-6 text-center">
                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className={`p-1 border rounded-md text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
