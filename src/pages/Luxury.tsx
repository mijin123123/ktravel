import React from 'react';
import ProductList from '../components/products/ProductList';
import { Product } from '../types';

const LuxuryPage: React.FC = () => {
  const luxuryProducts: Product[] = [
    // 럭셔리 여행 상품 데이터 예시
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">💎 럭셔리</h1>
      <ProductList products={luxuryProducts} />
    </div>
  );
};

export default LuxuryPage;
