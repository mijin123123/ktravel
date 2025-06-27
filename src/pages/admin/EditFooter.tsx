import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FooterContent, FooterLink, SocialLink } from '../../types';

const EditFooter: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFooterData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('footer_content')
      .select('content')
      .eq('id', 1)
      .single(); // 항상 하나의 행만 가져옴

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: 행이 없는 경우
      console.error("Failed to load footer data:", fetchError);
      setError('푸터 정보를 불러오는 데 실패했습니다.');
      setIsLoading(false);
    } else if (data && data.content) {
      setFooterData(data.content as FooterContent);
    } else {
      // 데이터가 없는 경우 기본값 설정
      setFooterData({
        description: "K-Travel과 함께하는 특별한 여행. 전 세계 최고의 여행 상품을 만나보세요.",
        packages: { title: "여행 패키지", links: [{ text: "", url: "" }] },
        company: { title: "회사 정보", links: [{ text: "", url: "" }] },
        customerCenter: { title: "고객센터", info: [""] },
        social: [{ name: "", url: "" }]
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFooterData();
  }, [fetchFooterData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (footerData) {
      setFooterData({ ...footerData, [name]: value });
    }
  };

  const handleLinkChange = (section: 'packages' | 'company', index: number, field: keyof FooterLink, value: string) => {
    if (footerData) {
      const newLinks = [...footerData[section].links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      setFooterData({ ...footerData, [section]: { ...footerData[section], links: newLinks } });
    }
  };

  const handleCustomerInfoChange = (index: number, value: string) => {
    if (footerData) {
      const newInfo = [...footerData.customerCenter.info];
      newInfo[index] = value;
      setFooterData({ ...footerData, customerCenter: { ...footerData.customerCenter, info: newInfo } });
    }
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    if (footerData) {
      const newSocial = [...footerData.social];
      newSocial[index] = { ...newSocial[index], [field]: value };
      setFooterData({ ...footerData, social: newSocial });
    }
  };

  const addLink = (section: 'packages' | 'company') => {
    if (footerData) {
      const newLinks = [...footerData[section].links, { text: '', url: '' }];
      setFooterData({ ...footerData, [section]: { ...footerData[section], links: newLinks } });
    }
  };

  const removeLink = (section: 'packages' | 'company', index: number) => {
    if (footerData) {
      const newLinks = footerData[section].links.filter((_, i) => i !== index);
      setFooterData({ ...footerData, [section]: { ...footerData[section], links: newLinks } });
    }
  };

  const addCustomerInfo = () => {
    if (footerData) {
      const newInfo = [...footerData.customerCenter.info, ''];
      setFooterData({ ...footerData, customerCenter: { ...footerData.customerCenter, info: newInfo } });
    }
  };

  const removeCustomerInfo = (index: number) => {
    if (footerData) {
      const newInfo = footerData.customerCenter.info.filter((_, i) => i !== index);
      setFooterData({ ...footerData, customerCenter: { ...footerData.customerCenter, info: newInfo } });
    }
  };

  const addSocialLink = () => {
    if (footerData) {
      const newSocial = [...footerData.social, { name: 'Facebook', url: '' }];
      setFooterData({ ...footerData, social: newSocial });
    }
  };

  const removeSocialLink = (index: number) => {
    if (footerData) {
      const newSocial = footerData.social.filter((_, i) => i !== index);
      setFooterData({ ...footerData, social: newSocial });
    }
  };

  const handleSaveChanges = async () => {
    if (!footerData) return;
    setError(null);

    const { error: saveError } = await supabase
      .from('footer_content')
      .upsert({ id: 1, content: footerData }); // id가 1인 행을 찾아 업데이트하거나, 없으면 새로 만듭니다.

    if (saveError) {
      console.error('Error saving footer data:', saveError);
      setError('푸터 정보 저장에 실패했습니다.');
      alert('푸터 정보 저장에 실패했습니다.');
    } else {
      alert('푸터 정보가 성공적으로 저장되었습니다.');
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading footer editor...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!footerData) {
    return <div className="p-6">Failed to load footer data.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">푸터 수정</h1>
        <button onClick={handleSaveChanges} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          변경사항 저장
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">소개 문구</h2>
          <textarea name="description" value={footerData.description} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3}></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 여행 패키지 수정 */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">여행 패키지</h3>
            {footerData.packages.links.map((link, index) => (
              <div key={index} className="flex items-center mb-2">
                <input type="text" placeholder="텍스트" value={link.text} onChange={e => handleLinkChange('packages', index, 'text', e.target.value)} className="w-1/2 p-2 border rounded mr-2" />
                <input type="text" placeholder="URL" value={link.url} onChange={e => handleLinkChange('packages', index, 'url', e.target.value)} className="w-1/2 p-2 border rounded mr-2" />
                <button type="button" onClick={() => removeLink('packages', index)} className="text-red-500 hover:text-red-700">삭제</button>
              </div>
            ))}
            <button type="button" onClick={() => addLink('packages')} className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
              패키지 링크 추가
            </button>
          </div>

          {/* 회사 정보 수정 */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">회사 정보</h3>
            <input type="text" name="title" value={footerData.company.title} onChange={(e) => setFooterData({ ...footerData, company: { ...footerData.company, title: e.target.value } })} className="w-full p-2 border rounded mb-2" />
            {footerData.company.links.map((link, index) => (
              <div key={index} className="flex items-center mb-2">
                <input type="text" placeholder="텍스트" value={link.text} onChange={(e) => handleLinkChange('company', index, 'text', e.target.value)} className="w-1/2 p-2 border rounded mr-2" />
                <input type="text" placeholder="URL" value={link.url} onChange={(e) => handleLinkChange('company', index, 'url', e.target.value)} className="w-1/2 p-2 border rounded mr-2" />
                <button type="button" onClick={() => removeLink('company', index)} className="text-red-500 hover:text-red-700">삭제</button>
              </div>
            ))}
            <button type="button" onClick={() => addLink('company')} className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
              회사 정보 링크 추가
            </button>
          </div>

          {/* 고객센터 정보 수정 */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">고객센터</h3>
            <input type="text" name="title" value={footerData.customerCenter.title} onChange={(e) => setFooterData({ ...footerData, customerCenter: { ...footerData.customerCenter, title: e.target.value } })} className="w-full p-2 border rounded mb-2" />
            {footerData.customerCenter.info.map((info, index) => (
              <div key={index} className="flex items-center mb-2">
                <input type="text" value={info} onChange={(e) => handleCustomerInfoChange(index, e.target.value)} className="w-full p-2 border rounded mr-2" />
                <button type="button" onClick={() => removeCustomerInfo(index)} className="text-red-500 hover:text-red-700">삭제</button>
              </div>
            ))}
            <button type="button" onClick={addCustomerInfo} className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
              고객센터 정보 추가
            </button>
          </div>

          {/* 소셜 링크 수정 */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">소셜 링크</h3>
            {footerData.social.map((link, index) => (
              <div key={index} className="flex items-center mb-2">
                <select value={link.name} onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)} className="w-1/3 p-2 border rounded mr-2">
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube</option>
                </select>
                <input type="text" placeholder="URL" value={link.url} onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} className="w-2/3 p-2 border rounded mr-2" />
                <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500 hover:text-red-700">삭제</button>
              </div>
            ))}
            <button type="button" onClick={addSocialLink} className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
              소셜 링크 추가
            </button>
          </div>

          <button onClick={handleSaveChanges} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            변경사항 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFooter;
