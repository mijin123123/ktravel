import { useState, useEffect, useCallback } from 'react';
import { TravelPackage } from '../../types';
import ProductModal from '../../components/admin/ProductModal';
import { supabase } from '../../lib/supabaseClient'; // supabase 클라이언트 임포트

const ManageProducts = () => {
  const [products, setProducts] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TravelPackage | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }
      setProducts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      console.error("상품 정보 로딩 실패:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: TravelPackage) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;

        // UI에서 즉시 삭제된 항목 제거
        setProducts(products.filter((p) => p.id !== productId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '상품 삭제 중 오류가 발생했습니다.';
        console.error(errorMessage);
        alert(errorMessage);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (productToSave: Omit<TravelPackage, 'id'> & { id?: string }) => {
    try {
      // productToSave에서 id를 명시적으로 분리하고, 나머지 데이터만 productData로 사용합니다.
      const { id, ...productData } = productToSave;

      if (selectedProduct && selectedProduct.id) {
        // 수정 모드: selectedProduct.id를 사용하여 업데이트합니다.
        const { data, error } = await supabase
          .from('products')
          .update(productData) // id가 없는 순수 데이터를 업데이트합니다.
          .eq('id', selectedProduct.id)
          .select()
          .single();

        if (error) throw error;
        
        setProducts(products.map((p) => (p.id === data.id ? data : p)));

      } else {
        // 추가 모드: id를 제외한 productData를 삽입합니다.
        const { data, error } = await supabase
          .from('products')
          .insert([productData]) 
          .select()
          .single();
        
        if (error) throw error;

        setProducts([...products, data]);
      }
      handleCloseModal();
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '상품 저장 중 오류가 발생했습니다.';
        console.error(errorMessage);
        alert(errorMessage);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
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
        <h1 className="text-3xl font-bold text-gray-800">상품 관리</h1>
        <button 
          onClick={handleAddNewProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          + 새 상품 추가
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">상품명</th>
              <th className="py-3 px-6 text-left">카테고리</th>
              <th className="py-3 px-6 text-right">원가</th>
              <th className="py-3 px-6 text-right">할인율</th>
              <th className="py-3 px-6 text-right font-bold">최종가</th>
              <th className="py-3 px-6 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product) => {
              const finalPrice = product.price * (1 - (product.discountRate || 0));
              return (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-4 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-left">{product.category}</td>
                  <td className="py-4 px-6 text-right">{formatPrice(product.price)}</td>
                  <td className="py-4 px-6 text-right text-red-500">{`${((product.discountRate || 0) * 100).toFixed(0)}%`}</td>
                  <td className="py-4 px-6 text-right font-bold text-blue-600">{formatPrice(finalPrice)}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-full text-xs mr-2"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-xs"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ManageProducts;
