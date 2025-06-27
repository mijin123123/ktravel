// src/pages/admin/AccountManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AccountInfo } from '../../types';

const AccountManagement = () => {
  const [account, setAccount] = useState<Partial<AccountInfo>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      setIsLoading(true);
      // 계좌 정보는 보통 하나만 존재하므로, id 1을 기준으로 가져옵니다.
      const { data, error } = await supabase.from('account_info').select('*').eq('id', 1).single();
      if (data) {
        setAccount(data);
      } else if (error) {
        console.warn('계좌 정보를 불러오지 못했습니다. 새로 생성해주세요.', error.message);
      }
      setIsLoading(false);
    };
    fetchAccount();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!account.bank_name || !account.account_number || !account.account_holder) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    // id가 있으면 update, 없으면 insert (id: 1)
    const { error } = await supabase.from('account_info').upsert({ ...account, id: 1 });

    if (error) {
      alert('저장에 실패했습니다: ' + error.message);
    } else {
      alert('성공적으로 저장되었습니다.');
    }
  };

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">계좌 관리</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">은행명</label>
          <input type="text" name="bank_name" value={account.bank_name || ''} onChange={handleChange} className="p-2 border rounded w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">계좌번호</label>
          <input type="text" name="account_number" value={account.account_number || ''} onChange={handleChange} className="p-2 border rounded w-full" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">예금주</label>
          <input type="text" name="account_holder" value={account.account_holder || ''} onChange={handleChange} className="p-2 border rounded w-full" />
        </div>
        <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
          저장
        </button>
      </div>
    </div>
  );
};

export default AccountManagement;
