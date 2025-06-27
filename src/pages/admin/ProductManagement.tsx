// src/pages/admin/ProductManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { TravelPackage } from '../../types';

// Modal Component
const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      alert('상품명, 카테고리, 가격은 필수 항목입니다.');
      return;
    }
    onSave(formData);
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{formData.id ? '상품 수정' : '새 상품 추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="상품명" value={formData.name} onChange={handleChange} className="p-2 border rounded" required />
            <input type="text" name="category" placeholder="카테고리" value={formData.category} onChange={handleChange} className="p-2 border rounded" required />
            <input type="text" name="destination" placeholder="여행지 (e.g., 유럽)" value={formData.destination} onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="price" placeholder="가격" value={formData.price} onChange={handleChange} className="p-2 border rounded" required />
            <input type="number" name="days" placeholder="여행일수" value={formData.days} onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="discountRate" placeholder="할인율 (e.g., 0.1 for 10%)" step="0.01" min="0" max="1" value={formData.discountRate} onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="rating" placeholder="평점 (0-5)" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} className="p-2 border rounded" />
            <input type="text" name="type" placeholder="상품 타입 (e.g., culture)" value={formData.type} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div className="mt-4">
            <input type="text" name="image" placeholder="이미지 URL" value={formData.image} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div className="mt-4">
            <textarea name="description" placeholder="상품 설명" value={formData.description} onChange={handleChange} className="p-2 border rounded w-full h-24"></textarea>
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">취소</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ProductManagement = () => {
  const [products, setProducts] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Partial<TravelPackage> | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      setError('상품 목록을 불러오는데 실패했습니다.');
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product: TravelPackage | null) => {
    setSelectedProduct(product || {
      name: '', category: '', destination: '', price: 0, days: 1,
      discountRate: 0, image: '', rating: 0, description: '', type: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (productData: Partial<TravelPackage>) => {
    const { id, ...upsertData } = productData;

    const query = id
      ? supabase.from('products').update(upsertData).eq('id', id)
      : supabase.from('products').insert([upsertData]);

    const { error } = await query;

    if (error) {
      alert('상품 저장에 실패했습니다: ' + error.message);
    } else {
      alert('상품이 성공적으로 저장되었습니다.');
      handleCloseModal();
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        alert('상품 삭제에 실패했습니다: ' + error.message);
      } else {
        alert('상품이 삭제되었습니다.');
        fetchProducts();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <button onClick={() => handleOpenModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + 새 상품 추가
        </button>
      </div>

      {isLoading && <p>상품 목록을 불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!isLoading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">상품명</th>
                <th className="py-3 px-6 text-left">카테고리</th>
                <th className="py-3 px-6 text-center">가격</th>
                <th className="py-3 px-6 text-center">여행지</th>
                <th className="py-3 px-6 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                  <td className="py-3 px-6 text-left">{product.category}</td>
                  <td className="py-3 px-6 text-right">{product.price.toLocaleString()}원</td>
                  <td className="py-3 px-6 text-center">{product.destination}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleOpenModal(product)} className="bg-green-500 text-white text-xs px-3 py-1 rounded-full mr-2 hover:bg-green-600">수정</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <ProductModal 
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductManagement;
