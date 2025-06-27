import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Account as SupabaseAccount } from '../../types'; // Supabase 타입(snake_case)
import AccountModal from '../../components/admin/AccountModal';

// 컴포넌트 내부에서 사용할 camelCase 타입 정의
interface DisplayAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDefault: boolean;
  created_at?: string;
}

const ManageAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<DisplayAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<DisplayAccount | null>(null);
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태

  const fetchAccounts = useCallback(async () => {
    // Supabase 에러 변수명을 fetchError로 변경하여 useState의 error와 충돌 방지
    const { data, error: fetchError } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching accounts:', fetchError);
      setError('계좌 정보를 불러오는 데 실패했습니다.');
      setAccounts([]);
    } else {
      // Supabase(snake_case) -> 내부 상태(camelCase) 변환
      const formattedData: DisplayAccount[] = data.map(acc => ({
        id: acc.id,
        bankName: acc.bank_name,
        accountNumber: acc.account_number,
        accountHolder: acc.account_holder,
        isDefault: acc.is_default,
        created_at: acc.created_at,
      }));
      setAccounts(formattedData);
      setError(null);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleAddAccount = () => {
    setSelectedAccount({ id: '', bankName: '', accountNumber: '', accountHolder: '', isDefault: false });
    setIsModalOpen(true);
  };

  const handleEditAccount = (account: DisplayAccount) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (window.confirm('정말로 이 계좌를 삭제하시겠습니까?')) {
      const { error: deleteError } = await supabase.from('accounts').delete().eq('id', accountId);
      if (deleteError) {
        console.error('Error deleting account:', deleteError);
        setError('계좌 삭제에 실패했습니다.');
      } else {
        fetchAccounts();
      }
    }
  };

  const handleSaveAccount = async (account: DisplayAccount) => {
    // 내부 상태(camelCase) -> Supabase(snake_case) 변환
    const accountData: Omit<SupabaseAccount, 'id' | 'created_at'> & { id?: string } = {
      bank_name: account.bankName,
      account_number: account.accountNumber,
      account_holder: account.accountHolder,
      is_default: account.isDefault,
    };
    
    if (account.isDefault) {
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ is_default: false })
        .eq('is_default', true);

      if (updateError) {
        console.error('Error resetting default account:', updateError);
        setError('기본 계좌 설정에 실패했습니다.');
        return;
      }
    }

    let response;
    if (account.id) { // ID가 있으면 수정
      const { error } = await supabase.from('accounts').update(accountData).eq('id', account.id);
      response = { error };
    } else { // ID가 없으면 추가
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...insertData } = accountData; // 혹시 모를 id 필드 제거
      const { error } = await supabase.from('accounts').insert(insertData);
      response = { error };
    }

    if (response.error) {
      console.error('Error saving account:', response.error);
      setError('계좌 저장에 실패했습니다.');
    } else {
      setIsModalOpen(false);
      fetchAccounts();
    }
  };

  const handleSetDefault = async (accountId: string) => {
    const { error: resetError } = await supabase
      .from('accounts')
      .update({ is_default: false })
      .neq('id', accountId);

    if (resetError) {
      console.error('Error resetting other accounts:', resetError);
      setError('기본 계좌 설정에 실패했습니다.');
      return;
    }

    const { error: setTrueError } = await supabase
      .from('accounts')
      .update({ is_default: true })
      .eq('id', accountId);

    if (setTrueError) {
      console.error('Error setting default account:', setTrueError);
      setError('기본 계좌 설정에 실패했습니다.');
    } else {
      fetchAccounts();
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">계좌 관리</h1>
        <button onClick={handleAddAccount} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          새 계좌 추가
        </button>
      </div>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

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

      {isModalOpen && selectedAccount && (
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
