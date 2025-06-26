import React from 'react';
import { Account } from '../../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
  account: Account | null;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave, account }) => {
  const [formData, setFormData] = React.useState<Account | null>(null);

  React.useEffect(() => {
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
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{account?.id ? '계좌 수정' : '새 계좌 추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">은행명</label>
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
