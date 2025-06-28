import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Booking } from '../../types'; // Booking 타입을 정의해야 합니다.

// 예약 목록을 가져오는 함수 (RPC 필요)
const getBookings = async () => {
  // Supabase 대시보드 > SQL Editor > New Query
  // 아래 SQL을 실행하여 함수를 만들어주세요.
  /*
  create or replace function get_all_bookings()
  returns table (
    id int,
    created_at timestamptz,
    user_id uuid,
    product_id int,
    booking_date text,
    guests int,
    total_price int,
    status text,
    user_email text,
    product_name text
  )
  language sql
  security definer
  as $$
    select 
      b.id, 
      b.created_at, 
      b.user_id, 
      b.product_id, 
      b.booking_date, 
      b.guests, 
      b.total_price, 
      b.status,
      u.email as user_email,
      p.name as product_name
    from bookings b
    left join auth.users u on b.user_id = u.id
    left join products p on b.product_id = p.id
    order by b.created_at desc;
  $$;
  */
  const { data, error } = await supabase.rpc('get_all_bookings');
  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
  return data;
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      setError('예약 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      
      alert('예약 상태가 변경되었습니다.');
      fetchBookings(); // 목록 새로고침
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">오류: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">예약 관리</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">예약 번호</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">예약자</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상품명</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">예약일</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상태</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{booking.id}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{booking.user_email || '알 수 없음'}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{booking.product_name || '알 수 없음'}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(booking.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{booking.status}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                   <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="p-1 border rounded"
                   >
                      <option value="pending">결제 대기</option>
                      <option value="confirmed">예약 확정</option>
                      <option value="cancelled">예약 취소</option>
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

export default BookingManagement;
