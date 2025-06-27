import { useState, useEffect } from 'react';
import { TravelPackage } from '../../types';
import ProductModal from '../../components/admin/ProductModal';

const ManageProducts = () => {
  const [products, setProducts] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TravelPackage | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error('상품 정보를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddNewProduct = () => {
    console.log('새 상품 추가 버튼 클릭');
    setSelectedProduct(null); // 새 상품이므로 null
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: TravelPackage) => {
    console.log(`수정 버튼 클릭: ${product.id}`);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log(`삭제 버튼 클릭: ${productId}`);
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      setProducts(products.filter((p) => p.id !== productId));
      // TODO: 실제 API 연동 시 서버에 삭제 요청 보내기
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (productToSave: TravelPackage) => {
    if (selectedProduct) {
      // 수정
      setProducts(products.map((p) => (p.id === productToSave.id ? productToSave : p)));
    } else {
      // 추가
      const newProduct = { ...productToSave, id: new Date().getTime().toString() }; // 문자열 ID 생성
      setProducts([...products, newProduct]);
    }
    // TODO: 실제 API 연동 시 서버에 저장 요청 보내기
    handleCloseModal();
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
