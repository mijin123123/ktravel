import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// 사용자 목록을 가져오는 함수 (Supabase Admin API 필요 - 여기서는 RPC로 대체)
const getUsers = async () => {
  // Supabase 대시보드 > SQL Editor > New Query
  // 아래 SQL을 실행하여 함수를 만들어주세요.
  /*
  create or replace function get_all_users() 
  returns table (user_id uuid, email text, role text, created_at timestamptz)
  language sql
  security definer
  as $$
    select u.id as user_id, u.email, u.role, u.created_at from auth.users u order by u.created_at desc;
  $$;
  */
  const { data, error } = await supabase.rpc('get_all_users');
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  // rpc 결과가 User 타입과 완전히 일치하지 않을 수 있으므로, 필요한 필드만 매핑합니다.
  return data.map((user: any) => ({
    id: user.user_id,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  }));
};

// 사용자를 삭제하는 함수 (RPC 필요)
const deleteUser = async (userId: string) => {
  // Supabase 대시보드 > SQL Editor > New Query
  // 아래 SQL을 실행하여 함수를 만들어주세요.
  /*
  create or replace function delete_user(user_id uuid) 
  returns void 
  language plpgsql 
  security definer
  as $$
  begin
    delete from auth.users where id = user_id;
  end;
  $$;
  */
  const { error } = await supabase.rpc('delete_user', { user_id: userId });
  if (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('회원 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까? 되돌릴 수 없습니다.')) {
      try {
        await deleteUser(userId);
        alert('회원이 삭제되었습니다.');
        fetchUsers(); // 목록 새로고침
      } catch (err) {
        alert('회원 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">오류: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">회원 관리</h1>
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
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.role}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
