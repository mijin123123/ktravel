import React from 'react';
import ProductList from '../components/products/ProductList';
import { Product } from '../types';

const GolfPage: React.FC = () => {
  const golfProducts: Product[] = [
    // 골프여행 상품 데이터 예시
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">⛳ 골프여행</h1>
      <ProductList products={golfProducts} />
    </div>
  );
};

export default GolfPage;
