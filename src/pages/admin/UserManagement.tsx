import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// profiles 테이블에서 사용자 목록을 가져오는 함수
const getUsers = async () => {
  console.log('[DEBUG] Fetching users from profiles table...');
  
  try {
    // 1. 직접 profiles 테이블 조회 방식
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[DEBUG] Error fetching users from profiles:', error);
      throw error;
    }
    
    console.log('[DEBUG] Users fetched from profiles:', data);
    
    // profiles 테이블의 결과를 필요한 형식으로 매핑
    return data?.map((profile: any) => ({
      id: profile.id,
      email: profile.email,
      role: profile.role || 'user',
      created_at: profile.created_at,
    })) || [];
  } catch (err) {
    console.error('[DEBUG] Unexpected error in getUsers:', err);
    throw err;
  }
};

// 사용자 삭제 함수 (실제로는 role을 'deleted'로 변경)
const deleteUser = async (userId: string) => {
  console.log('[DEBUG] Marking user for deletion, ID:', userId);
  
  try {
    // 1. 직접 profiles 테이블 업데이트 방식
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'deleted' })
      .eq('id', userId);
    
    console.log('[DEBUG] Delete API response:', { data, error });
    
    if (error) {
      console.error('[DEBUG] Error marking user for deletion:', error);
      throw error;
    }
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.warn('[DEBUG] No rows were updated');
      // 명시적으로 해당 사용자가 있는지 확인
      const { data: checkData, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      console.log('[DEBUG] User check result:', { checkData, checkError });
      
      if (checkError || !checkData) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
    }
    
    return { success: true, message: '사용자가 삭제 처리되었습니다.' };
  } catch (err) {
    console.error('[DEBUG] Unexpected error in deleteUser:', err);
    throw err;
  }
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<{[key: string]: boolean}>({});
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data || []);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('[DEBUG] Error in fetchUsers:', err);
      setError(`회원 정보를 불러오는 중 오류가 발생했습니다: ${err.message || ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('[DEBUG] UserManagement component mounted');
    fetchUsers();
    
    // public.profiles 테이블에 대한 실시간 구독
    const subscription = supabase
      .channel('profiles_changes')
      .on('postgres_changes', {
        event: '*',  // 모든 이벤트(insert, update, delete)
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        console.log('[DEBUG] Realtime profiles update received:', payload);
        // 데이터 변경 시 목록 새로고침
        fetchUsers();
      })
      .subscribe((status) => {
        console.log('[DEBUG] Profiles subscription status:', status);
      });
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      console.log('[DEBUG] Unsubscribing from profiles changes');
      subscription.unsubscribe();
    };
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('정말로 이 회원을 삭제 처리하시겠습니까?')) {
      return;
    }
    
    try {
      // 특정 사용자의 삭제 상태만 변경
      setIsDeleting(prev => ({ ...prev, [userId]: true }));
      
      console.log('[DEBUG] Starting user deletion process for ID:', userId);
      const result = await deleteUser(userId);
      console.log('[DEBUG] Delete result:', result);

      // 성공 시 UI에서 사용자 역할을 'deleted'로 변경
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, role: 'deleted' } 
            : user
        )
      );
      
      alert('회원이 삭제 처리되었습니다.');
      
      // 추가 검증을 위해 서버에서 최신 데이터 다시 가져오기
      setTimeout(() => {
        fetchUsers();
      }, 1000);
    } catch (err: any) {
      alert(`회원 삭제 처리 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`);
      console.error('[DEBUG] Error deleting user:', err);
    } finally {
      setIsDeleting(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoading && users.length === 0) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">오류: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">회원 관리</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">마지막 업데이트: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <button 
          onClick={() => fetchUsers()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="bg-yellow-100 p-4 rounded">등록된 회원이 없습니다.</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">이메일</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">역할</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">가입일</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(user => user.role !== 'deleted')
                .map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.role}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="text-red-600 hover:text-red-900"
                      disabled={isDeleting[user.id]}
                    >
                      {isDeleting[user.id] ? '처리 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4">
        <details>
          <summary className="text-sm text-gray-500 cursor-pointer">디버깅 정보</summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(users, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default UserManagement;
