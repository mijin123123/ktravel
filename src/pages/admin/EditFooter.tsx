import React, { useState, useEffect } from 'react';
import { FooterContent, FooterLink, SocialLink } from '../../types';

const EditFooter: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/footer.json')
      .then(res => res.json())
      .then(data => {
        setFooterData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load footer data:", error);
        setIsLoading(false);
      });
  }, []);

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

  const handleSaveChanges = () => {
    // In a real application, this would send a POST request to an API endpoint to save the file.
    console.log("Saving footer data:", JSON.stringify(footerData, null, 2));
    alert('푸터 정보가 콘솔에 저장되었습니다. (실제 앱에서는 서버로 전송됩니다)');
  };

  if (isLoading) {
    return <div className="p-6">Loading footer editor...</div>;
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
          <section>
            <h2 className="text-xl font-semibold mb-2">여행 패키지 링크</h2>
            {footerData.packages.links.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input type="text" placeholder="텍스트" value={link.text} onChange={e => handleLinkChange('packages', index, 'text', e.target.value)} className="w-1/2 p-2 border rounded" />
                <input type="text" placeholder="URL" value={link.url} onChange={e => handleLinkChange('packages', index, 'url', e.target.value)} className="w-1/2 p-2 border rounded" />
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">회사 정보 링크</h2>
            {footerData.company.links.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input type="text" placeholder="텍스트" value={link.text} onChange={e => handleLinkChange('company', index, 'text', e.target.value)} className="w-1/2 p-2 border rounded" />
                <input type="text" placeholder="URL" value={link.url} onChange={e => handleLinkChange('company', index, 'url', e.target.value)} className="w-1/2 p-2 border rounded" />
              </div>
            ))}
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
                <h2 className="text-xl font-semibold mb-2">고객센터 정보</h2>
                {footerData.customerCenter.info.map((info, index) => (
                <input key={index} type="text" value={info} onChange={e => handleCustomerInfoChange(index, e.target.value)} className="w-full p-2 border rounded mb-2" />
                ))}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">소셜 미디어 링크</h2>
                {footerData.social.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <input type="text" placeholder="이름 (Instagram, Facebook...)" value={link.name} onChange={e => handleSocialLinkChange(index, 'name', e.target.value)} className="w-1/2 p-2 border rounded" />
                    <input type="text" placeholder="URL" value={link.url} onChange={e => handleSocialLinkChange(index, 'url', e.target.value)} className="w-1/2 p-2 border rounded" />
                </div>
                ))}
            </section>
        </div>

      </div>
    </div>
  );
};

export default EditFooter;
