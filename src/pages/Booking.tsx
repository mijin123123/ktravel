// src/pages/Booking.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { TravelPackage } from '../types';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const packageId = searchParams.get('packageId');
  const date = searchParams.get('date');
  const travelers = searchParams.get('travelers');

  const [pkg, setPackage] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) {
        setError('잘못된 접근입니다: 상품 ID가 없습니다.');
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', packageId)
        .single();

      if (error) {
        console.error('Error fetching package:', error);
        setError('상품 정보를 불러오는 데 실패했습니다.');
      } else {
        setPackage(data);
      }
      setLoading(false);
    };

    fetchPackage();
  }, [packageId]);

  if (loading) {
    return <div className="container-custom py-12 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="container-custom py-12 text-center text-red-500">{error}</div>;
  }
  
  if (!pkg) {
    return <div className="container-custom py-12 text-center">상품 정보를 찾을 수 없습니다.</div>;
  }

  const price = pkg.price || 0;
  const discountRate = pkg.discountRate || 0;
  const numTravelers = Number(travelers || 1);
  const totalPrice = price * (1 - discountRate) * numTravelers;

  const handlePayment = () => {
    const params = new URLSearchParams();
    params.set('packageName', pkg.name);
    params.set('totalPrice', totalPrice.toString());
    params.set('date', date || '');
    params.set('travelers', travelers || '');
    navigate(`/payment?${params.toString()}`);
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">예약 확정</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">상품 정보</h2>
          <img src={pkg.image || 'https://via.placeholder.com/400x300'} alt={pkg.name} className="w-full h-64 object-cover rounded-lg mb-4" />
          <h3 className="text-xl font-semibold">{pkg.name}</h3>
          <p className="text-gray-600">{pkg.destination}</p>
          <div className="mt-4">
            <p><span className="font-semibold">출발일:</span> {date}</p>
            <p><span className="font-semibold">인원:</span> {travelers}명</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">결제 정보</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">상품 가격</span>
              <span className="text-lg">{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-xl font-bold">총 결제 금액</span>
              <span className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()}원</span>
            </div>
            <button 
              onClick={handlePayment}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-colors"
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
