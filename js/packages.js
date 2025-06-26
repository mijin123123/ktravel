document.addEventListener('DOMContentLoaded', function() {
    console.log('K-Travel 패키지 페이지가 로드되었습니다.');

    // 전체 패키지 데이터
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

    const packageListContainer = document.getElementById('package-list');
    const noResultsContainer = document.getElementById('no-results');
    const filterForm = document.getElementById('filter-form');

    // URL에서 쿼리 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search') || '';
    const initialType = urlParams.get('type') || '';

    // 필터 폼에 초기값 설정
    document.getElementById('destination-filter').value = initialSearch;
    document.querySelector(`input[name="travel-type"][value="${initialType}"]`).checked = true;

    // 패키지 렌더링 함수
    function renderPackages(filter) {
        const filteredPackages = travelPackages.filter(pkg => {
            const destinationMatch = !filter.destination || pkg.destination.toLowerCase().includes(filter.destination.toLowerCase());
            const typeMatch = !filter.type || pkg.type === filter.type;
            return destinationMatch && typeMatch;
        });

        packageListContainer.innerHTML = '';

        if (filteredPackages.length > 0) {
            noResultsContainer.classList.add('hidden');
            packageListContainer.classList.remove('hidden');
            filteredPackages.forEach(pkg => {
                const packageCard = `
                <div class="bg-white rounded-xl shadow-subtle overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <a href="package-detail.html?id=${pkg.id}" class="block">
                        <div class="h-56 bg-cover bg-center" style="background-image: url('${pkg.image}')"></div>
                        <div class="p-6">
                            <div class="flex justify-between items-center text-sm text-text-light mb-2">
                                <span>${pkg.destination}</span>
                                <span><i class="far fa-clock mr-1"></i>${pkg.days}일</span>
                            </div>
                            <h3 class="text-lg font-bold text-text mb-4 h-14 overflow-hidden">${pkg.name}</h3>
                            <div class="flex justify-between items-center">
                                <p class="text-xl font-bold text-primary">₩${formatPrice(pkg.price)}~</p>
                                <div class="flex items-center">
                                    <i class="fas fa-star text-accent mr-1"></i>
                                    <span class="font-bold text-text">${pkg.rating}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                `;
                packageListContainer.innerHTML += packageCard;
            });
        } else {
            packageListContainer.classList.add('hidden');
            noResultsContainer.classList.remove('hidden');
        }
    }

    // 필터 폼 제출 이벤트 리스너
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const destination = document.getElementById('destination-filter').value;
        const type = document.querySelector('input[name="travel-type"]:checked').value;
        renderPackages({ destination, type });
    });

    // 초기 로드 시 패키지 렌더링
    renderPackages({ destination: initialSearch, type: initialType });
});

// 가격 포맷팅 함수
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
