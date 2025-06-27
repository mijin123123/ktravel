import { useState, useEffect, useCallback } from 'react';
import { User } from '../../types';
import UserModal from '../../components/admin/UserModal';
import { supabase } from '../../lib/supabaseClient';

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setUsers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      console.error("회원 정보 로딩 실패:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        setUsers(users.filter((u) => u.id !== userId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '회원 삭제 중 오류가 발생했습니다.';
        console.error(errorMessage);
        alert(errorMessage);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userToSave: Omit<User, 'id' | 'created_at'> & { id?: string }) => {
    try {
      if (selectedUser && userToSave.id) {
        // 수정
        const { id, ...updateData } = userToSave;
        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        setUsers(users.map((u) => (u.id === data.id ? data : u)));
      } else {
        // 추가
        const { id, ...insertData } = userToSave;
        const { data, error } = await supabase
          .from('users')
          .insert([insertData])
          .select()
          .single();
        
        if (error) throw error;

        setUsers([data, ...users]);
      }
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '회원 정보 저장 중 오류가 발생했습니다.';
      console.error(errorMessage);
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">에러: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">회원 관리</h1>
        <button 
          onClick={handleAddNewUser}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          + 새 회원 추가
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">이름</th>
              <th className="py-3 px-6 text-left">이메일</th>
              <th className="py-3 px-6 text-left">연락처</th>
              <th className="py-3 px-6 text-center">역할</th>
              <th className="py-3 px-6 text-left">가입일</th>
              <th className="py-3 px-6 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left">{user.name}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.phone}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full ${ user.role === 'admin' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800' }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-center">
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-xs mr-2 transition duration-300"
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-xs transition duration-300"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
};

export default ManageUsers;
