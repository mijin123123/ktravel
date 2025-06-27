// src/pages/admin/FooterManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FooterInfo } from '../../types';

const FooterManagement = () => {
  const [footerInfo, setFooterInfo] = useState<Partial<FooterInfo>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooterInfo = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('footer_info').select('*').eq('id', 1).single();
      if (data) {
        setFooterInfo(data);
      } else if (error) {
        console.warn('푸터 정보를 불러오지 못했습니다. 새로 생성해주세요.', error.message);
      }
      setIsLoading(false);
    };
    fetchFooterInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFooterInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { error } = await supabase.from('footer_info').upsert({ ...footerInfo, id: 1 });
    if (error) {
      alert('저장에 실패했습니다: ' + error.message);
    } else {
      alert('성공적으로 저장되었습니다.');
    }
  };

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">푸터 관리</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">회사명</label>
            <input type="text" name="company_name" value={footerInfo.company_name || ''} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">주소</label>
            <input type="text" name="address" value={footerInfo.address || ''} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">전화번호</label>
            <input type="text" name="phone_number" value={footerInfo.phone_number || ''} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">사업자 등록번호</label>
            <input type="text" name="business_registration_number" value={footerInfo.business_registration_number || ''} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">이용약관 URL</label>
            <input type="text" name="terms_url" value={footerInfo.terms_url || ''} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">개인정보처리방침 URL</label>
            <input type="text" name="privacy_policy_url" value={footerInfo.privacy_policy_url || ''} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
        </div>
        <div className="mt-8">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterManagement;
