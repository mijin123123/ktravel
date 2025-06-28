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
  console.log('Fetching users...');
  const { data, error } = await supabase.rpc('get_all_users');
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  console.log('Users fetched:', data);
  
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
  -- 먼저 함수가 존재하는지 확인하고 삭제
  DROP FUNCTION IF EXISTS delete_user(uuid);
  
  -- 새로 함수 생성
  create or replace function delete_user(user_id uuid) 
  returns json 
  language plpgsql 
  security definer
  as $$
  declare
    deleted_rows int;
    result json;
  begin
    delete from auth.users where id = user_id;
    GET DIAGNOSTICS deleted_rows = ROW_COUNT;
    
    if deleted_rows > 0 then
      result := json_build_object('success', true, 'message', 'User deleted successfully');
    else
      result := json_build_object('success', false, 'message', 'No user found with that ID');
    end if;
    
    return result;
  end;
  $$;
  */
  
  console.log('Attempting to delete user with ID:', userId);
  const { data, error } = await supabase.rpc('delete_user', { user_id: userId });
  
  if (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
  
  console.log('Delete user response:', data);
  
  // 삭제 성공 여부를 명시적으로 확인 후 반환
  if (data && data.success) {
    return { success: true, message: data.message };
  } else {
    throw new Error(data?.message || 'Failed to delete user');
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError('회원 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // 실시간 구독 설정
    // 참고: auth.users 테이블은 기본적으로 변경 사항을 구독할 수 없을 수 있음
    // Supabase 대시보드에서 다음 작업이 필요할 수 있습니다:
    // 1. Database > Replication > 실시간(Realtime) 활성화
    // 2. auth 스키마의 테이블 변경사항 구독 설정
    const subscription = supabase
      .channel('auth_users_changes')
      .on('postgres_changes', {
        event: '*',  // 모든 이벤트(insert, update, delete)
        schema: 'auth',
        table: 'users'
      }, (payload) => {
        console.log('Realtime update received:', payload);
        // 데이터 변경 시 목록 새로고침
        fetchUsers();
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까? 되돌릴 수 없습니다.')) {
      try {
        setIsDeleting(true);
        
        console.log('Starting user deletion process for ID:', userId);
        // 삭제 작업이 완료될 때까지 명시적으로 대기
        const result = await deleteUser(userId);
        console.log('Delete result:', result);

        if (result.success) {
          // 삭제 성공 시 UI에서도 직접 해당 사용자를 제거
          setUsers(prevUsers => {
            const filteredUsers = prevUsers.filter(user => user.id !== userId);
            console.log(`Filtered users from ${prevUsers.length} to ${filteredUsers.length}`);
            return filteredUsers;
          });
          alert('회원이 삭제되었습니다.');
          
          // 추가 검증을 위해 서버에서 최신 데이터 다시 가져오기
          setTimeout(() => {
            fetchUsers();
          }, 1000);
        }
      } catch (err: any) {
        alert(`회원 삭제 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`);
        console.error('Error deleting user:', err);
      } finally {
        setIsDeleting(false);
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
