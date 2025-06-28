import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// profiles 테이블에서 사용자 목록을 가져오는 함수
const getUsers = async () => {
  console.log('Fetching users from profiles table...');
  
  // 1. 직접 profiles 테이블 조회 방식
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  // 2. 대체 방법: RPC 함수 사용
  // const { data, error } = await supabase.rpc('get_all_profiles');
  
  if (error) {
    console.error('Error fetching users from profiles:', error);
    throw error;
  }
  
  console.log('Users fetched from profiles:', data);
  
  // profiles 테이블의 결과를 필요한 형식으로 매핑
  return data.map((profile: any) => ({
    id: profile.id,
    email: profile.email,
    role: profile.role || 'user',
    created_at: profile.created_at,
    // 추가 필요한 필드가 있다면 여기에 추가
  }));
};

// 사용자 삭제 함수 (실제로는 role을 'deleted'로 변경)
const deleteUser = async (userId: string) => {
  console.log('Marking user for deletion, ID:', userId);
  
  // 1. 직접 profiles 테이블 업데이트 방식
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'deleted' })
    .eq('id', userId);
  
  // 2. 대체 방법: RPC 함수 사용
  // const { data, error } = await supabase.rpc('mark_user_for_deletion', { user_id: userId });
  
  if (error) {
    console.error('Error marking user for deletion:', error);
    throw error;
  }
  
  console.log('User marked as deleted:', data);
  return { success: true, message: '사용자가 삭제 처리되었습니다.' };
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
    
    // public.profiles 테이블에 대한 실시간 구독
    const subscription = supabase
      .channel('profiles_changes')
      .on('postgres_changes', {
        event: '*',  // 모든 이벤트(insert, update, delete)
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        console.log('Realtime profiles update received:', payload);
        // 데이터 변경 시 목록 새로고침
        fetchUsers();
      })
      .subscribe((status) => {
        console.log('Profiles subscription status:', status);
      });
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('정말로 이 회원을 삭제 처리하시겠습니까?')) {
      try {
        setIsDeleting(true);
        
        console.log('Starting user deletion process for ID:', userId);
        const result = await deleteUser(userId);
        console.log('Delete result:', result);

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
            {users.filter(user => user.role !== 'deleted').map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.role}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="text-red-600 hover:text-red-900"
                    disabled={isDeleting}
                  >
                    {isDeleting ? '처리 중...' : '삭제'}
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
