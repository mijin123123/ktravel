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
    setSelectedProduct(null); // 새 상품이므로 null
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: TravelPackage) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
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
      const newProduct = { ...productToSave, id: `pkg${Date.now()}` }; // 임시 ID 생성
      setProducts([...products, newProduct]);
    }
    // TODO: 실제 API 연동 시 서버에 저장 요청 보내기
    handleCloseModal();
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
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">상품명</th>
              <th className="py-3 px-6 text-left">지역</th>
              <th className="py-3 px-6 text-right">가격</th>
              <th className="py-3 px-6 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap">{product.id}</td>
                <td className="py-3 px-6 text-left">{product.name}</td>
                <td className="py-3 px-6 text-left">{product.destination}</td>
                <td className="py-3 px-6 text-right">{product.price.toLocaleString()}원</td>
                <td className="py-3 px-6 text-center">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-xs mr-2 transition duration-300"
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
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
      <ProductModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </div>
  );
};

export default ManageProducts;
