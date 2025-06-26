import React, { useState, useEffect } from 'react';
import { TravelPackage } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: TravelPackage) => void;
  product: TravelPackage | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const getInitialFormData = (): TravelPackage => {
    return product || {
      id: '', // 새 상품의 ID는 저장 시점에 생성됩니다.
      name: '',
      destination: '',
      region: '',
      image: '',
      price: 0,
      days: 0,
      description: '',
      rating: 0,
      type: '',
    };
  };

  const [formData, setFormData] = useState<TravelPackage>(getInitialFormData);

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [isOpen, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumberField = ['price', 'days', 'rating'].includes(name);
    const processedValue = isNumberField ? parseFloat(value) || 0 : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
        onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{product ? '상품 수정' : '새 상품 추가'}</h2>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="상품명" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="여행지" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="지역" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="가격" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="number" name="days" value={formData.days} onChange={handleChange} placeholder="여행 기간 (일)" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} placeholder="평점" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="타입 (예: 신혼 여행)" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="이미지 URL" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="상품 설명" className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} required></textarea>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">취소</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">저장</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
