import React from 'react';
import ProductList from '../components/products/ProductList';
import { Product } from '../types';

const OverseasPage: React.FC = () => {
  // 이 데이터는 API 호출 등을 통해 동적으로 가져와야 합니다.
  const overseasProducts: Product[] = [
    {
      id: 1,
      name: '파리 로맨틱 5일 투어',
      description: '에펠탑, 루브르 박물관, 개선문을 포함한 완벽한 파리 경험',
      price: 1690000,
      image: '/images/package-1.jpg',
      category: '해외여행',
      rating: 5,
      reviews: 142,
      discount: 10,
      originalPrice: 1880000,
      tags: ['인기상품', '로맨틱']
    },
    {
      id: 2,
      name: '도쿄 핵심 일정 3일',
      description: '신주쿠부터 아사쿠사까지, 도쿄의 모든 매력을 담은 여행',
      price: 840000,
      image: '/images/package-2.jpg',
      category: '해외여행',
      rating: 5,
      reviews: 98,
      tags: ['인기상품', '문화탐방']
    },
    // 추가 해외여행 상품
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">✈️ 해외여행</h1>
      <ProductList products={overseasProducts} />
    </div>
  );
};

export default OverseasPage;
