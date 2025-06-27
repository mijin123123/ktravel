// src/pages/Payment.tsx
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AccountInfo } from '../types';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const packageName = searchParams.get('packageName');
  const totalPrice = searchParams.get('totalPrice');
  const date = searchParams.get('date');
  const travelers = searchParams.get('travelers');

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('account_info')
          .select('*')
          .single();

        if (error) {
          throw error;
        }
        setAccountInfo(data);
      } catch (error) {
        console.error('Error fetching account info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleConfirmPayment = () => {
    // 실제로는 여기서 결제 API를 호출합니다.
    alert('결제가 완료되었습니다! (시뮬레이션)');
    // 결제 완료 후 주문 완료 페이지로 이동하거나 다른 처리를 할 수 있습니다.
    // window.location.href = '/order-confirmation';
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">결제 진행</h1>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">주문 정보 확인</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">상품명</p>
            <p>{packageName || '정보 없음'}</p>
          </div>
          <div>
            <p className="font-semibold">여행일</p>
            <p>{date || '정보 없음'}</p>
          </div>
          <div>
            <p className="font-semibold">인원</p>
            <p>{travelers ? `${travelers}명` : '정보 없음'}</p>
          </div>
          <div className="border-t pt-4 mt-4">
            <p className="font-semibold text-lg">총 결제 금액</p>
            <p className="text-2xl font-bold text-blue-600">{totalPrice ? `${Number(totalPrice).toLocaleString()}원` : '정보 없음'}</p>
          </div>
        </div>

        {/* 계좌 정보 */}
        {loading ? (
          <p className="text-center mt-6">계좌 정보 로딩 중...</p>
        ) : accountInfo ? (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-bold mb-4 text-center">입금 계좌 안내</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="font-semibold">{accountInfo.bank_name}</p>
              <p className="my-1">{accountInfo.account_number}</p>
              <p>예금주: {accountInfo.account_holder}</p>
            </div>
          </div>
        ) : (
           <p className="text-center mt-6 text-red-500">계좌 정보를 불러오지 못했습니다.</p>
        )}

        <button 
          onClick={handleConfirmPayment}
          className="mt-8 w-full bg-green-500 text-white py-3 rounded-md font-bold hover:bg-green-600 transition-colors"
        >
          최종 결제 확정
        </button>
      </div>
    </div>
  );
};

export default Payment;
