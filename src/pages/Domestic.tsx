import React from 'react';
import ProductList from '../components/products/ProductList';
import { Product } from '../types';

const DomesticPage: React.FC = () => {
  const domesticProducts: Product[] = [
    {
      id: 3,
      name: '제주 프리미엄 3일',
      description: '에코랜드, 카멜리아 힐, 섭지코지를 포함한 럭셔리 일정',
      price: 480000,
      image: '/images/package-3.jpg',
      category: '국내숙소',
      rating: 4.5,
      reviews: 23,
      tags: ['NEW', '가족여행']
    },
    // 추가 국내숙소 상품
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">🏨 국내숙소</h1>
      <ProductList products={domesticProducts} />
    </div>
  );
};

export default DomesticPage;
