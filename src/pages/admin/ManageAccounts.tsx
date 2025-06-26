import React, { useState, useEffect } from 'react';
import { Account } from '../../types';
import AccountModal from '../../components/admin/AccountModal';

const ManageAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetch('/accounts.json')
      .then(res => res.json())
      .then(data => setAccounts(data));
  }, []);

  const handleAddAccount = () => {
    setSelectedAccount({ id: `acc${Date.now()}`, bankName: '', accountNumber: '', accountHolder: '', isDefault: false });
    setIsModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('정말로 이 계좌를 삭제하시겠습니까?')) {
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      // In a real app, you would also make an API call to delete the account
      console.log(`Account ${accountId} deleted`);
    }
  };

  const handleSaveAccount = (account: Account) => {
    if (selectedAccount && selectedAccount.id.startsWith('acc')) { // Distinguish new from existing
        // Edit existing account
        setAccounts(prev => prev.map(acc => acc.id === account.id ? account : acc));
    } else {
        // Add new account
        setAccounts(prev => [...prev, account]);
    }
    // In a real app, you would also make an API call to save the account
    console.log('Account saved:', account);
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleSetDefault = (accountId: string) => {
    setAccounts(prev => 
      prev.map(acc => ({ ...acc, isDefault: acc.id === accountId }))
    );
    // In a real app, you would also make an API call to update the default status
    console.log(`Account ${accountId} set as default`);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">계좌 관리</h1>
        <button onClick={handleAddAccount} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          새 계좌 추가
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">은행명</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">계좌번호</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">예금주</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">기본 계좌</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{account.bankName}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{account.accountNumber}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{account.accountHolder}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {account.isDefault ? 
                    <span className='text-green-600 font-bold'>기본</span> : 
                    <button onClick={() => handleSetDefault(account.id)} className='text-gray-500 hover:text-gray-700'>설정</button>}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button onClick={() => handleEditAccount(account)} className="text-indigo-600 hover:text-indigo-900 mr-3">수정</button>
                  <button onClick={() => handleDeleteAccount(account.id)} className="text-red-600 hover:text-red-900">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AccountModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveAccount} 
          account={selectedAccount}
        />
      )}
    </div>
  );
};

export default ManageAccounts;
