// src/pages/admin/MenuManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MenuCategory } from '../../types';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<MenuCategory> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchMenus = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .order('parent_id, id');

    if (error) {
      console.error('Error fetching menus:', error);
      setError('메뉴 목록을 불러오는데 실패했습니다.');
    } else {
      setMenuItems(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleEdit = (item: MenuCategory) => {
    setEditingItem({ ...item });
    setIsNew(false);
  };

  const handleAddNew = () => {
    setEditingItem({
      name: '',
      url: '',
      parent_id: null,
    });
    setIsNew(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({
      ...editingItem,
      [name]: name === 'parent_id' ? (value ? parseInt(value, 10) : null) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const dataToSubmit = {
      name: editingItem.name || '',
      url: editingItem.url || '',
      parent_id: editingItem.parent_id === undefined ? null : editingItem.parent_id,
    };

    let response;
    if (isNew) {
      response = await supabase.from('menu').insert(dataToSubmit).select();
    } else {
      if (editingItem.id === undefined) {
        alert('메뉴 수정을 위한 ID가 없습니다.');
        return;
      }
      response = await supabase.from('menu').update(dataToSubmit).eq('id', editingItem.id);
    }

    if (response.error) {
      alert('메뉴 저장에 실패했습니다: ' + response.error.message);
    } else {
      alert('메뉴가 성공적으로 저장되었습니다.');
      setEditingItem(null);
      fetchMenus();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 메뉴를 삭제하시겠습니까? 하위 메뉴가 있는 경우 먼저 삭제해야 합니다.')) {
      const { error } = await supabase.from('menu').delete().eq('id', id);
      if (error) {
        alert('메뉴 삭제에 실패했습니다: ' + error.message);
      } else {
        alert('메뉴가 삭제되었습니다.');
        fetchMenus();
      }
    }
  };
  
  const parentMenus = menuItems.filter(item => item.parent_id === null);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">메뉴 관리</h1>
        <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          새 메뉴 추가
        </button>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{isNew ? '새 메뉴 추가' : '메뉴 수정'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">이름</label>
                <input type="text" name="name" value={editingItem.name || ''} onChange={handleChange} className="w-full p-2 border rounded-md" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">URL</label>
                <input type="text" name="url" value={editingItem.url || ''} onChange={handleChange} className="w-full p-2 border rounded-md" required placeholder="/best/japan 또는 /community" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">상위 메뉴</label>
                <select name="parent_id" value={editingItem.parent_id || ''} onChange={handleChange} className="w-full p-2 border rounded-md">
                  <option value="">없음 (최상위 메뉴)</option>
                  {parentMenus.filter(menu => menu.id !== editingItem.id).map(menu => (
                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">취소</button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && <p>메뉴 목록을 불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">이름</th>
                <th className="py-3 px-6 text-left">URL</th>
                <th className="py-3 px-6 text-left">상위 메뉴</th>
                <th className="py-3 px-6 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {menuItems.map(item => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{item.id}</td>
                  <td className="py-3 px-6 text-left font-bold">{item.parent_id ? '\u00a0\u00a0└ ' : ''}{item.name}</td>
                  <td className="py-3 px-6 text-left">{item.url}</td>
                  <td className="py-3 px-6 text-left">{menuItems.find(p => p.id === item.parent_id)?.name || '-'}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full hover:bg-yellow-600 mr-2">수정</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600">삭제</button>
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

export default MenuManagement;
