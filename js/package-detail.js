document.addEventListener('DOMContentLoaded', function() {
    // 전체 패키지 데이터 (packages.js와 동일하게 유지)
    const travelPackages = [
        {
            id: '1',
            name: '이탈리아 완전 일주 7일',
            destination: '이탈리아',
            image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1966&auto=format&fit=crop',
            price: 2890000,
            days: 7,
            description: '로마, 피렌체, 베네치아 등 이탈리아 핵심 도시를 모두 둘러보는 클래식 코스입니다. 바티칸 박물관 우선 입장 혜택이 포함되어 있습니다.',
            rating: 4.8,
            type: '패키지'
        },
        {
            id: '2',
            name: '스위스 융프라우 5일',
            destination: '스위스',
            image: 'https://images.unsplash.com/photo-1539035104074-dee66086b5e3?q=80&w=2070&auto=format&fit=crop',
            price: 3200000,
            days: 5,
            description: '알프스의 심장, 융프라우에서 즐기는 하이킹과 그림 같은 풍경. 인터라켄에서의 자유시간이 포함되어 있습니다.',
            rating: 4.9,
            type: '자유여행'
        },
        {
            id: '3',
            name: '파리 감성 허니문 6일',
            destination: '프랑스',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80',
            price: 4500000,
            days: 6,
            description: '낭만의 도시 파리에서의 로맨틱한 허니문. 세느강 디너 크루즈와 에펠탑 전망의 호텔 숙박이 포함됩니다.',
            rating: 4.9,
            type: '허니문'
        },
        {
            id: '4',
            name: '스페인 예술 기행 8일',
            destination: '스페인',
            image: 'https://images.unsplash.com/photo-1578305283389-451c9a4319e0?q=80&w=1974&auto=format&fit=crop',
            price: 3100000,
            days: 8,
            description: '가우디의 도시 바르셀로나와 정열의 도시 마드리드를 여행하며 스페인 예술의 정수를 느껴보세요.',
            rating: 4.7,
            type: '패키지'
        },
        {
            id: '5',
            name: '베트남 다낭/호이안 4일',
            destination: '베트남',
            image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop',
            price: 890000,
            days: 4,
            description: '아름다운 해변과 고즈넉한 구시가지의 매력을 동시에 즐길 수 있는 다낭과 호이안으로 떠나는 힐링 여행.',
            rating: 4.6,
            type: '자유여행'
        },
        {
            id: '6',
            name: '미서부 그랜드 서클 9일',
            destination: '미국',
            image: 'https://images.unsplash.com/photo-1589995153580-189b65a41d39?q=80&w=2070&auto=format&fit=crop',
            price: 4200000,
            days: 9,
            description: '그랜드 캐니언, 자이언 캐니언, 브라이스 캐니언 등 대자연의 경이로움을 만끽하는 최고의 미서부 로드 트립.',
            rating: 4.9,
            type: '패키지'
        }
    ];

    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    const packageData = travelPackages.find(p => p.id === packageId);

    const container = document.getElementById('package-detail-container');
    const pageTitle = document.getElementById('page-title');

    if (packageData) {
        // Update page title
        pageTitle.textContent = `${packageData.name} | K-Travel`;

        // Render package details
        container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Main Content -->
            <div class="lg:col-span-2 bg-white p-8 rounded-xl shadow-subtle">
                <div class="h-96 bg-cover bg-center rounded-lg mb-8" style="background-image: url('${packageData.image}')"></div>
                <h1 class="text-3xl font-bold text-text mb-4">${packageData.name}</h1>
                <p class="text-text-light mb-6">${packageData.description}</p>
                
                <div class="border-t border-border pt-6">
                    <h2 class="text-2xl font-bold text-text mb-4">여행 정보</h2>
                    <div class="grid grid-cols-2 gap-4 text-lg">
                        <div class="flex items-center"><i class="fas fa-map-marker-alt text-primary mr-3"></i> <span>${packageData.destination}</span></div>
                        <div class="flex items-center"><i class="far fa-clock text-primary mr-3"></i> <span>${packageData.days}일</span></div>
                        <div class="flex items-center"><i class="fas fa-star text-accent mr-3"></i> <span>${packageData.rating}점</span></div>
                        <div class="flex items-center"><i class="fas fa-tag text-primary mr-3"></i> <span>${packageData.type}</span></div>
                    </div>
                </div>
            </div>

            <!-- Sticky Booking Card -->
            <aside class="lg:col-span-1">
                <div class="sticky-card bg-white p-8 rounded-xl shadow-subtle">
                    <h2 class="text-2xl font-bold text-text mb-2">여행 예약</h2>
                    <p class="text-text-light mb-6">지금 바로 예약하고 특별한 여행을 떠나보세요.</p>
                    <p class="text-3xl font-extrabold text-primary mb-1">₩${formatPrice(packageData.price)}<span class="text-lg font-medium text-text-light">~</span></p>
                    <p class="text-text-light text-sm mb-6">1인 기준</p>
                    <button class="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors text-lg">
                        예약하기
                    </button>
                    <button class="w-full mt-3 bg-background-alt text-text font-bold py-3 px-6 rounded-lg hover:bg-border transition-colors">
                        여행 문의
                    </button>
                </div>
            </aside>
        </div>
        `;
    } else {
        container.innerHTML = `
        <div class="text-center py-24">
            <i class="fas fa-exclamation-triangle text-5xl text-red-400 mb-4"></i>
            <h1 class="text-3xl font-bold">패키지를 찾을 수 없습니다.</h1>
            <p class="text-text-light mt-2">요청하신 여행 패키지 정보를 찾을 수 없습니다. <br>홈페이지로 돌아가 다시 시도해주세요.</p>
            <a href="/" class="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition-all">
                홈으로 돌아가기
            </a>
        </div>
        `;
    }
});

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
