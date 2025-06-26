import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      {/* 회사 소개 헤더 */}
      <section className="bg-gray-900 text-white">
        <div className="container-custom py-20">
          <h1 className="text-4xl font-bold mb-6">TRIP STORE 소개</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            최고의 해외여행 경험을 제공하는 TRIP STORE는 2010년 설립 이래 고객님의 특별한 순간을 함께해왔습니다.
          </p>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">우리의 비전</h2>
              <p className="text-gray-600 mb-4">
                TRIP STORE는 고객의 꿈을 실현하는 여행을 만들어 갑니다. 우리는 단순한 여행 상품을 판매하는 것이 아니라, 
                삶의 특별한 경험과 추억을 선사합니다.
              </p>
              <p className="text-gray-600">
                우리의 목표는 각 여행자의 개성과 취향에 맞춘 맞춤형 서비스를 제공하고, 모든 고객이 기대 이상의 경험을 할 수 있도록 
                끊임없이 혁신하고 발전하는 것입니다.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                alt="여행 이미지" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 우리의 가치 */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">우리의 가치</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">고객 중심</h3>
              <p className="text-gray-600">
                고객의 만족을 최우선으로 생각합니다. 여행 전, 여행 중, 여행 후까지 고객의 행복을 위해 최선을 다합니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">안전과 신뢰</h3>
              <p className="text-gray-600">
                고객의 안전은 타협할 수 없는 가치입니다. 엄격한 기준으로 모든 여행 상품을 검증하고, 신뢰할 수 있는 파트너와만 협력합니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">맞춤형 경험</h3>
              <p className="text-gray-600">
                각 고객의 니즈와 선호도를 이해하고, 개인화된 여행 경험을 제공합니다. 단체 여행도 마치 나만을 위한 여행처럼 특별하게 만듭니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 회사 연혁 */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">회사 연혁</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <h3 className="text-xl font-bold text-primary-600">2010년</h3>
              </div>
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold mb-2">TRIP STORE 설립</h4>
                <p className="text-gray-600">
                  서울 강남에 본사 설립. 해외여행 전문 여행사로 첫 발걸음을 내딛다.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <h3 className="text-xl font-bold text-primary-600">2013년</h3>
              </div>
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold mb-2">아시아 지역 서비스 확장</h4>
                <p className="text-gray-600">
                  일본, 동남아 등 아시아 지역 여행 상품 확대. 연간 이용 고객 1만 명 돌파.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <h3 className="text-xl font-bold text-primary-600">2016년</h3>
              </div>
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold mb-2">유럽 전문팀 신설</h4>
                <p className="text-gray-600">
                  유럽 지역 전문 가이드와 상품기획팀 보강. 프리미엄 유럽 투어 상품 출시.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <h3 className="text-xl font-bold text-primary-600">2019년</h3>
              </div>
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold mb-2">온라인 예약 시스템 오픈</h4>
                <p className="text-gray-600">
                  모바일 친화적인 온라인 예약 시스템 구축. 고객 편의성 강화.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <h3 className="text-xl font-bold text-primary-600">2023년</h3>
              </div>
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold mb-2">지속가능한 여행 이니셔티브 출범</h4>
                <p className="text-gray-600">
                  환경 친화적이고 지속가능한 여행 상품 개발. 친환경 여행 인증 획득.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <h3 className="text-xl font-bold text-primary-600">2025년</h3>
              </div>
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold mb-2">글로벌 네트워크 확장</h4>
                <p className="text-gray-600">
                  전 세계 50개국 이상의 전문 파트너 네트워크 구축. 연간 이용 고객 5만 명 달성.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">함께 특별한 여행을 만들어보세요</h2>
            <p className="text-white text-opacity-90 mb-6">
              TRIP STORE와 함께라면, 평생 간직할 수 있는 특별한 추억이 됩니다.
              지금 바로 상담을 신청하고 여행 계획을 시작하세요.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100 px-6 py-3">
                상담 신청하기
              </Link>
              <Link to="/packages" className="btn border border-white text-white hover:bg-primary-700 px-6 py-3">
                패키지 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
