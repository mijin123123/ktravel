// src/pages/admin/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { UserProfile } from '../../types';

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      setError('회원 목록을 불러오는데 실패했습니다.');
    } else {
      setUsers(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('역할 변경에 실패했습니다: ' + error.message);
    } else {
      alert('역할이 성공적으로 변경되었습니다.');
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까? 관련된 모든 데이터가 삭제될 수 있으며, 되돌릴 수 없습니다.')) {
      // IMPORTANT: Supabase Edge Function을 호출하여 auth.users에서 사용자를 삭제해야 합니다.
      // 클라이언트에서 직접 auth.users를 조작하는 것은 보안상 위험하며 기본적으로 비활성화되어 있습니다.
      // 여기서는 예시로 RPC 함수를 호출하는 코드를 작성합니다.
      // 실제로는 Supabase 대시보드에서 `delete_user` 함수를 생성해야 합니다.
      const { error } = await supabase.rpc('delete_user', { user_id: userId });

      if (error) {
        alert('회원 삭제에 실패했습니다: ' + error.message);
        console.error('Error deleting user:', error);
        // 에러가 발생하면 profiles 테이블이라도 수동으로 삭제 시도 (임시 방편)
        const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
        if (profileError) {
          console.error('Error deleting profile after auth user deletion failed:', profileError);
        }

      } else {
        alert('회원이 삭제되었습니다.');
        fetchUsers();
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">회원 관리</h1>
      {isLoading && <p>회원 목록을 불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">이메일</th>
                <th className="py-3 px-6 text-left">이름</th>
                <th className="py-3 px-6 text-center">역할</th>
                <th className="py-3 px-6 text-center">가입일</th>
                <th className="py-3 px-6 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.full_name}</td>
                  <td className="py-3 px-6 text-center">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="p-1 border rounded-md text-xs"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
