import React, { useState, useEffect } from 'react';

// 부모 컴포넌트(ManageAccounts)에서 정의한 camelCase 타입과 일치시킵니다.
interface DisplayAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDefault: boolean;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: DisplayAccount) => void; // 받는 타입도 DisplayAccount로 변경
  account: DisplayAccount | null; // 받는 타입도 DisplayAccount로 변경
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave, account }) => {
  // 내부 상태도 DisplayAccount를 사용합니다.
  const [formData, setFormData] = useState<DisplayAccount | null>(null);

  useEffect(() => {
    setFormData(account);
  }, [account]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: type === 'checkbox' ? checked : value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData); // DisplayAccount 객체를 그대로 전달
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{account?.id ? '계좌 수정' : '새 계좌 추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">은행명</label>
            {/* form의 name과 value도 모두 camelCase로 통일합니다. */}
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">계좌번호</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">예금주</label>
            <input type="text" name="accountHolder" value={formData.accountHolder} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="mr-2" />
              기본 계좌로 설정
            </label>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">취소</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
