import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { TravelPackage } from '../../types';

const ProductManagement = () => {
  const [products, setProducts] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<TravelPackage>>({});
  const [isEditing, setIsEditing] = useState(false);

  // 모든 상품 불러오기
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('상품 목록 조회 실패:', err);
      setError('상품 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트시 상품 목록 불러오기
  useEffect(() => {
    fetchProducts();
  }, []);

  // 모달 열기: 신규 상품 추가
  const handleAddProduct = () => {
    setCurrentProduct({
      name: '',
      destination: '',
      category: '',
      description: '',
      price: 0,
      discountRate: 0,
      rating: 5.0,
      image: 'https://via.placeholder.com/400x300'
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // 모달 열기: 기존 상품 수정
  const handleEditProduct = (product: TravelPackage) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // 폼 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // 숫자 필드는 숫자로 변환
    if (type === 'number') {
      setCurrentProduct({
        ...currentProduct,
        [name]: parseFloat(value)
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value
      });
    }
  };

  // 상품 저장 (추가 또는 수정)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 데이터 유효성 검사
      if (!currentProduct.name || !currentProduct.destination || !currentProduct.price) {
        alert('상품명, 여행지, 가격은 필수 항목입니다.');
        return;
      }

      // 데이터 준비 (컬럼명 주의: discountRate -> discount_rate 변환 가능성)
      // 스키마에 맞는 형태로 데이터 구조화
      const productData = {
        name: currentProduct.name,
        destination: currentProduct.destination,
        category: currentProduct.category || '',
        description: currentProduct.description || '',
        price: currentProduct.price || 0,
        // discountRate 또는 discount_rate 중 테이블에 맞는 이름 사용
        discountRate: currentProduct.discountRate || 0, // 테이블 구조 확인 후 필요시 수정
        rating: currentProduct.rating || 5.0,
        image: currentProduct.image || 'https://via.placeholder.com/400x300'
      };

      console.log('저장할 데이터:', productData);

      let result;

      // 편집 모드: 기존 상품 수정
      if (isEditing && currentProduct.id) {
        console.log('수정 요청 ID:', currentProduct.id);
        
        // 직접 API 호출 (RPC 없이)
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id);

        if (result.error) {
          console.error('수정 오류:', result.error);
          throw result.error;
        }
        alert('상품이 수정되었습니다.');
        
        // UI 업데이트 (API 호출 없이)
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === currentProduct.id 
              ? { ...product, ...productData, id: currentProduct.id } 
              : product
          )
        );
      } 
      // 신규 모드: 새 상품 추가
      else {
        // 직접 API 호출 (RPC 없이)
        result = await supabase
          .from('products')
          .insert([productData]);

        if (result.error) {
          console.error('추가 오류:', result.error);
          throw result.error;
        }
        alert('상품이 추가되었습니다.');
        
        // 새로운 상품으로 목록 전체 새로고침
        fetchProducts();
      }

      // 모달 닫고 상품 목록 새로고침
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('상품 저장 실패:', err);
      alert('상품을 저장하는 중 오류가 발생했습니다.');
    }
  };

  // 상품 삭제
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('정말 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    
    try {
      console.log('삭제 요청 ID:', id); // 디버깅용
      
      // 직접 삭제 API 호출 (RPC 없이)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('삭제 오류:', error);
        throw error;
      }
      
      alert('상품이 삭제되었습니다.');
      // 삭제된 항목을 UI에서 즉시 제거 (API 호출 없이)
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (err) {
      console.error('상품 삭제 실패:', err);
      alert('상품을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">오류: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 새 상품 추가
        </button>
      </div>

      {/* 상품 목록 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상품명</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">카테고리</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">가격</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">여행지</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.name}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.category || '-'}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {product.price?.toLocaleString()}원
                  {product.discountRate > 0 && (
                    <span className="ml-2 text-red-500 text-xs">
                      ({product.discountRate * 100}% 할인)
                    </span>
                  )}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.destination}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm space-x-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id!)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-5 text-center text-sm text-gray-500">
                  등록된 상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 상품 추가/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEditing ? '상품 수정' : '새 상품 추가'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct}>
                <div className="space-y-4">
                  {/* 상품명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
                    <input
                      type="text"
                      name="name"
                      value={currentProduct.name || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* 여행지 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">여행지</label>
                    <input
                      type="text"
                      name="destination"
                      value={currentProduct.destination || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* 카테고리 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                    <select
                      name="category"
                      value={currentProduct.category || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">선택하세요</option>
                      <option value="유럽">유럽</option>
                      <option value="아시아">아시아</option>
                      <option value="미주">미주/중남미</option>
                      <option value="오세아니아">오세아니아</option>
                      <option value="아프리카">아프리카</option>
                    </select>
                  </div>

                  {/* 가격 및 할인율 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
                      <input
                        type="number"
                        name="price"
                        value={currentProduct.price || 0}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">할인율 (0~1)</label>
                      <input
                        type="number"
                        name="discountRate"
                        value={currentProduct.discountRate || 0}
                        onChange={handleChange}
                        min="0"
                        max="1"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* 평점 및 이미지 URL */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">평점 (0~5)</label>
                      <input
                        type="number"
                        name="rating"
                        value={currentProduct.rating || 5}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                      <input
                        type="text"
                        name="image"
                        value={currentProduct.image || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* 상품 설명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상품 설명</label>
                    <textarea
                      name="description"
                      value={currentProduct.description || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
