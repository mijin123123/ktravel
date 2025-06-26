import React, { useState, useEffect } from 'react';

// TypeScript 타입 정의
interface SubCategory {
  name: string;
  order: string;
}

interface MenuCategory {
  name: string;
  url: string;
  order: string;
  sub?: SubCategory[];
}

const Admin = () => {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<{ catIndex: number; subIndex: number; data: SubCategory } | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', url: '', order: '' });
  const [newSubCategory, setNewSubCategory] = useState<{ [key: number]: { name: string; order: string } }>({});
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 데이터 로드 및 인증
  useEffect(() => {
    // 인증 체크
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
      setIsAdmin(true);
    } else {
      const password = prompt("관리자 비밀번호를 입력하세요:", "");
      if (password === "admin123") { 
        sessionStorage.setItem('adminLoggedIn', 'true');
        setIsAdmin(true);
      } else {
        alert("비밀번호가 틀렸습니다.");
        setError("접근이 거부되었습니다. 올바른 비밀번호를 입력하고 페이지를 새로고침하세요.");
        setLoading(false);
        return;
      }
    }

    const fetchMenuData = async () => {
      try {
        const response = await fetch(`/menu.json?t=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('menu.json 로딩 실패');
        }
        const data = await response.json();
        // 데이터를 order 기준으로 정렬
        const sortedData = data.sort((a: MenuCategory, b: MenuCategory) => parseInt(a.order) - parseInt(b.order));
        sortedData.forEach((cat: MenuCategory) => {
            if (cat.sub) {
                cat.sub.sort((a, b) => parseInt(a.order) - parseInt(b.order));
            }
        });
        setMenuCategories(sortedData);
      } catch (err) {
        setError('menu.json을 불러오는데 실패했습니다. 파일이 public 폴더에 있는지 확인해주세요.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if(isAdmin) {
        fetchMenuData();
    }
  }, [isAdmin]);

  // 메뉴 변경사항 다운로드
  const downloadMenuJson = () => {
    const sortedCategories = [...menuCategories].sort((a, b) => parseInt(a.order) - parseInt(b.order));
    sortedCategories.forEach(cat => {
        if (cat.sub) {
            cat.sub.sort((a, b) => parseInt(a.order) - parseInt(b.order));
        }
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedCategories, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "menu.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    alert('menu.json 파일이 다운로드되었습니다. 이 파일을 프로젝트의 public 폴더에 덮어쓴 후, git에 푸시해주세요.');
  };

  // 카테고리 추가/수정 핸들러
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) { // 수정
      setMenuCategories(menuCategories.map(cat => cat.order === editingCategory.order ? { ...editingCategory, ...newCategory } : cat));
      setEditingCategory(null);
    } else { // 추가
      // 중복 순서 확인
      if (menuCategories.some(cat => cat.order === newCategory.order)) {
        alert("이미 사용 중인 순서입니다. 다른 순서를 입력해주세요.");
        return;
      }
      setMenuCategories([...menuCategories, { ...newCategory, sub: [] }]);
    }
    setNewCategory({ name: '', url: '', order: '' });
  };

  // 카테고리 수정 모드 시작
  const startEditingCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setNewCategory(category);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
  
  // 카테고리 삭제
  const deleteCategory = (order: string) => {
    if (window.confirm("정말로 이 카테고리를 삭제하시겠습니까? 하위 카테고리도 모두 삭제됩니다.")) {
        setMenuCategories(menuCategories.filter(cat => cat.order !== order));
    }
  };

  // 하위 카테고리 추가
  const handleSubCategorySubmit = (catIndex: number) => {
    const newSub = newSubCategory[catIndex];
    if (!newSub || !newSub.name || !newSub.order) {
        alert("하위 카테고리 이름과 순서를 모두 입력하세요.");
        return;
    }
    const updatedCategories = [...menuCategories];
    const parentCategory = updatedCategories[catIndex];
    if (!parentCategory.sub) {
        parentCategory.sub = [];
    }
    parentCategory.sub.push({ name: newSub.name, order: newSub.order });
    setMenuCategories(updatedCategories);
    setNewSubCategory({ ...newSubCategory, [catIndex]: { name: '', order: '' } });
  };

  // 하위 카테고리 삭제
  const deleteSubCategory = (catIndex: number, subIndex: number) => {
     if (window.confirm("정말로 이 하위 카테고리를 삭제하시겠습니까?")) {
        const updatedCategories = [...menuCategories];
        updatedCategories[catIndex].sub?.splice(subIndex, 1);
        setMenuCategories(updatedCategories);
    }
  }

  // 하위 카테고리 수정 시작
  const startEditingSubCategory = (catIndex: number, subIndex: number, sub: SubCategory) => {
    setEditingSubCategory({ catIndex, subIndex, data: { ...sub } });
  };

  // 하위 카테고리 수정 취소
  const cancelEditingSubCategory = () => {
    setEditingSubCategory(null);
  };

  // 하위 카테고리 업데이트
  const handleSubCategoryUpdate = () => {
    if (!editingSubCategory) return;

    const { catIndex, subIndex, data } = editingSubCategory;
    const updatedCategories = [...menuCategories];
    updatedCategories[catIndex].sub![subIndex] = data;
    setMenuCategories(updatedCategories);
    setEditingSubCategory(null);
  };

  if (loading) return <div className="p-8 text-center">데이터를 불러오는 중입니다...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!isAdmin) return <div className="p-8 text-center text-gray-600">인증이 필요합니다.</div>;

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">메뉴 카테고리 관리</h1>
        <button onClick={downloadMenuJson} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-bold transition-colors">
            💾 menu.json 저장
        </button>
      </div>

      {/* 카테고리 목록 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {menuCategories.map((cat, catIndex) => (
            <li key={cat.order}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer" onClick={() => setOpenSubMenu(openSubMenu === catIndex ? null : catIndex)}>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-indigo-600 truncate">{cat.order}. {cat.name} ({cat.url})</p>
                  <div className="ml-2 flex-shrink-0 flex items-center">
                    <button onClick={(e) => { e.stopPropagation(); startEditingCategory(cat); }} className="text-blue-500 hover:text-blue-700 mr-4">수정</button>
                    <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat.order); }} className="text-red-500 hover:text-red-700 mr-4">삭제</button>
                    <span className="text-gray-400">{openSubMenu === catIndex ? '▼' : '▶'}</span>
                  </div>
                </div>
              </div>

              {/* 하위 카테고리 */}
              {openSubMenu === catIndex && (
                <div className="px-4 py-5 sm:p-6 bg-gray-50">
                  <h3 className="text-md font-semibold mb-3">하위 카테고리 관리</h3>
                  <ul className="divide-y divide-gray-200">
                    {cat.sub?.map((sub, subIndex) => (
                      <li key={subIndex} className="py-3 flex justify-between items-center">
                        {editingSubCategory && editingSubCategory.catIndex === catIndex && editingSubCategory.subIndex === subIndex ? (
                            <div className="flex items-center space-x-2 w-full">
                                <input type="text" value={editingSubCategory.data.name} onChange={(e) => setEditingSubCategory({ ...editingSubCategory, data: { ...editingSubCategory.data, name: e.target.value } })} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                <input type="number" value={editingSubCategory.data.order} onChange={(e) => setEditingSubCategory({ ...editingSubCategory, data: { ...editingSubCategory.data, order: e.target.value } })} className="block w-24 shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                <button onClick={handleSubCategoryUpdate} className="text-green-600 hover:text-green-800 text-sm font-medium">저장</button>
                                <button onClick={cancelEditingSubCategory} className="text-gray-600 hover:text-gray-800 text-sm">취소</button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-700">{sub.order}. {sub.name}</p>
                                <div className="flex items-center">
                                    <button onClick={() => startEditingSubCategory(catIndex, subIndex, sub)} className="text-blue-500 hover:text-blue-700 text-xs mr-3 font-medium">수정</button>
                                    <button onClick={() => deleteSubCategory(catIndex, subIndex)} className="text-red-500 hover:text-red-700 text-xs font-medium">삭제</button>
                                </div>
                            </>
                        )}
                      </li>
                    ))}
                  </ul>
                  {/* 하위 카테고리 추가 폼 */}
                  <div className="mt-4 flex items-center space-x-2">
                      <input type="text" placeholder="하위 카테고리 이름" value={newSubCategory[catIndex]?.name || ''} onChange={(e) => setNewSubCategory({...newSubCategory, [catIndex]: {...(newSubCategory[catIndex] || {}), name: e.target.value}})} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                      <input type="number" placeholder="순서" value={newSubCategory[catIndex]?.order || ''} onChange={(e) => setNewSubCategory({...newSubCategory, [catIndex]: {...(newSubCategory[catIndex] || {}), order: e.target.value}})} className="block w-24 shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                      <button onClick={() => handleSubCategorySubmit(catIndex)} className="bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 text-sm">추가</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 메인 카테고리 추가 폼 */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">새 메뉴 카테고리 추가</h2>
        <form onSubmit={handleCategorySubmit} className="bg-white shadow sm:rounded-lg p-6 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
            <div className="sm:col-span-3">
                <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700">카테고리 이름</label>
                <input type="text" id="cat-name" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required/>
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="cat-url" className="block text-sm font-medium text-gray-700">URL (예: packages.html)</label>
                <input type="text" id="cat-url" value={newCategory.url} onChange={(e) => setNewCategory({...newCategory, url: e.target.value})} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required/>
            </div>
            <div className="sm:col-span-1">
                <label htmlFor="cat-order" className="block text-sm font-medium text-gray-700">순서</label>
                <input type="number" id="cat-order" value={newCategory.order} onChange={(e) => setNewCategory({...newCategory, order: e.target.value})} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required/>
            </div>
            <div className="sm:col-span-6">
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    {editingCategory ? '✔️ 카테고리 수정 완료' : '➕ 새 카테고리 추가'}
                </button>
                {editingCategory && (
                    <button type="button" onClick={() => { setEditingCategory(null); setNewCategory({ name: '', url: '', order: '' }); }} className="mt-2 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        취소
                    </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
