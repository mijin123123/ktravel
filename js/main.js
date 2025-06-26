// 메인 JavaScript 파일
document.addEventListener('DOMContentLoaded', async function() {
    console.log('TRIP STORE 웹사이트가 로드되었습니다.');
    
    try {
        console.log('===== JavaScript 실행 시작 =====');
    
        // 공통 헤더와 푸터를 로드하고 UI 설정이 완료될 때까지 기다립니다.
        await loadCommonComponents();
        console.log('공통 컴포넌트 로드 완료');
    
        // 각 상품 배열 상태 확인
        console.log('상품 데이터 상태:', { 
            'allProducts': allProducts?.length || 0,
            'uniqueProducts': uniqueProducts?.length || 0
        });
    
        // 공통 요소가 모두 준비된 후, 페이지별 컨텐츠를 표시합니다.
        routeContent();
    } catch (error) {
        console.error('사이트 초기화 중 오류 발생:', error);
    }
});

/**
 * 헤더와 푸터를 가져와 페이지에 삽입합니다.
 */
async function loadCommonComponents() {
    try {
        const cacheBuster = `?v=${Date.now()}`;
        const headerPromise = fetch(`/header.html${cacheBuster}`).then(res => res.text());
        const footerPromise = fetch(`/footer.html${cacheBuster}`).then(res => res.text());

        const [headerHTML, footerHTML] = await Promise.all([headerPromise, footerPromise]);

        const headerEl = document.getElementById('main-header');
        const footerEl = document.getElementById('main-footer');
        const appEl = document.getElementById('app');

        if (headerEl) {
            headerEl.innerHTML = headerHTML;
        }
        if (footerEl) {
            footerEl.innerHTML = footerHTML;
            applyFooterData(); // 관리자 페이지에서 수정한 푸터 정보 적용
        }
        
        // 헤더와 푸터가 DOM에 추가된 후 UI 관련 스크립트를 실행합니다.
        // 모달은 #app의 자식으로 추가해야 z-index 문제가 발생하지 않습니다.
        if (appEl) {
            setupHeaderUI(appEl);
        }

    } catch (error) {
        console.error('공통 컴포넌트 로딩 중 오류 발생:', error);
    }
}

/**
 * 로컬 스토리지에 저장된 푸터 정보를 실제 푸터 DOM에 적용합니다.
 */
function applyFooterData() {
    const savedData = JSON.parse(localStorage.getItem('footerData'));
    if (!savedData) return; // 저장된 데이터가 없으면 종료

    // 각 ID에 해당하는 요소를 찾아 텍스트를 업데이트합니다.
    const updateText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    updateText('footer-ceo', savedData.ceo);
    updateText('footer-business-number', savedData.businessNumber);
    updateText('footer-report-number', savedData.reportNumber);
    updateText('footer-tourism-number', savedData.tourismNumber);
    updateText('footer-address', savedData.address);
    updateText('footer-contact', savedData.contact);
    updateText('footer-contact-hours', savedData.contactHours);
}

/**
 * 헤더와 관련된 모든 UI 이벤트 리스너와 기능을 설정합니다.
 * @param {HTMLElement} appElement - 모달을 추가할 최상위 app 요소
 */
function setupHeaderUI(appElement) {
    createFullScreenMenu(appElement);
    setupHeaderScroll();
    setupAllMenuDropdown();
    setupMobileHeader();
    setupSearchForm();
    activateCurrentNav();
    // setupCategoryDropdowns(); // 모든 카테고리 드롭다운 메뉴 설정
}

/**
 * 모바일 헤더 (메뉴 & 검색) 설정
 */
function setupMobileHeader() {
    // 모바일 버튼 컨테이너 선택
    const mobileContainer = document.querySelector('.md\\:hidden');
    if (!mobileContainer) return;
    const buttons = mobileContainer.querySelectorAll('button');
    if (buttons.length < 2) return;
    const mobileSearchButton = buttons[0];
    const mobileMenuButton = buttons[1];

    // 전체 메뉴 모달 및 닫기 버튼
    const fullMenuModal = document.getElementById('full-menu-modal');
    const closeMenuButton = document.getElementById('full-menu-close');

    // 모바일 메뉴 버튼 이벤트
    if (mobileMenuButton && fullMenuModal && closeMenuButton) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fullMenuModal.classList.remove('hidden');
            fullMenuModal.classList.add('flex');
        });
        closeMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fullMenuModal.classList.add('hidden');
            fullMenuModal.classList.remove('flex');
        });
        fullMenuModal.addEventListener('click', (e) => {
            if (e.target === fullMenuModal) {
                e.preventDefault();
                e.stopPropagation();
                fullMenuModal.classList.add('hidden');
                fullMenuModal.classList.remove('flex');
            }
        });
    }

    // 모바일 검색 버튼 이벤트
    if (mobileSearchButton) {
        mobileSearchButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // 이미 오버레이가 있으면 무시
            if (document.getElementById('mobile-search-overlay')) return;

            // 검색 오버레이 생성
            const searchOverlay = document.createElement('div');
            searchOverlay.id = 'mobile-search-overlay';
            searchOverlay.className = 'fixed inset-0 bg-white z-[110] p-4 flex items-start transition-opacity duration-300 opacity-0';
            searchOverlay.innerHTML = `
                <div class="relative w-full mt-4">
                    <form id="mobile-search-form" class="flex items-center">
                        <input type="search" id="mobile-search-input" placeholder="도시나 상품을 검색해보세요" 
                               class="w-full rounded-full border border-gray-300 bg-gray-100 py-3 pl-6 pr-16 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                        <button type="submit" class="absolute right-12 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark">
                            <i class="fas fa-search text-xl"></i>
                        </button>
                        <button type="button" id="mobile-search-close" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </form>
                </div>
            `;
            document.body.appendChild(searchOverlay);

            const closeSearchButton = document.getElementById('mobile-search-close');
            const searchForm = document.getElementById('mobile-search-form');
            const searchInput = document.getElementById('mobile-search-input');

            setTimeout(() => searchOverlay.classList.remove('opacity-0'), 10);
            const closeSearch = () => {
                searchOverlay.classList.add('opacity-0');
                setTimeout(() => searchOverlay.remove(), 300);
            };
            closeSearchButton.addEventListener('click', closeSearch);

            searchForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `packages.html?search=${encodeURIComponent(query)}`;
                }
            });
            setTimeout(() => searchInput.focus(), 50);
        });
    }
}

/**
 * 현재 URL 경로를 기반으로 적절한 컨텐츠 로딩 함수를 실행합니다.
 */
function routeContent() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';

    switch (pageName) {
        case 'index.html':
        case '': // 루트 경로 (e.g., http://localhost:3000/)
            displayPopularPackages();
            break;
        case 'golf.html':
            displayGolfPackages();
            setupCountrySearchForm(); // 국가 검색 폼 설정 함수 호출
            setupCountryFilters('golf.html', golfPackages); // 국가별 필터 버튼 설정
            break;
        case 'companion.html':
            displayCompanionPackages();
            break;
        case 'best.html':
            displayBestPackages();
            break;
        case 'packages.html':
            displayAllTravelPackages();
            setupCountrySearchForm(); // 국가 검색 폼 설정 함수 호출
            setupCountryFilters('packages.html', allTravelPackages); // 국가별 필터 버튼 설정
            break;
        case 'hotels.html':
            displayHotelDeals();
            break;
        case 'tours-tickets.html':
            displayTourTickets();
            break;
        case 'domestic.html':
            displayDomesticAccommodations();
            setupCountrySearchForm(); // 지역 검색 폼 설정
            setupCountryFilters('domestic.html', domesticAccommodations); // 지역별 필터 버튼 설정
            setupDomesticFilters(); // 추가 필터 설정
            break;
        case 'theme.html':
            displayThemePackages();
            break;
        case 'custom.html':
            displayCustomPackages();
            break;
        case 'benefits.html':
            displayMonthlyBenefits();
            break;
        case 'community.html':
            displayCommunityPosts();
            break;
        case 'community-detail.html':
            displayCommunityPostDetail();
            break;
        case 'package-detail.html':
            displayPackageDetail();
            break;
    }
}

// 헤더 스크롤에 따른 스타일 변경
function setupHeaderScroll() {
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        });
    }
}

// 전체 메뉴 드롭다운 설정
function setupAllMenuDropdown() {
    const toggleButton = document.getElementById('all-menu-toggle');
    const categoryNav = document.getElementById('category-nav');

    if (toggleButton && categoryNav) {
        const dropdownHTML = `
            <div id="all-menu-dropdown" class="hidden absolute top-full left-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div class="p-8">
                    <div class="grid grid-cols-3 gap-x-8 gap-y-6">
                        
                        <div>
                            <h3 class="font-bold text-base mb-4 text-primary flex items-center"><i class="fa-solid fa-earth-asia mr-2"></i>여행</h3>
                            <ul class="space-y-3 text-sm">
                                <li><a href="./packages.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-plane-departure w-5 mr-1"></i>해외여행</a></li>
                                <li><a href="./domestic.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-map-marked-alt w-5 mr-1"></i>국내여행</a></li>
                                <li><a href="./golf.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-golf-ball-tee w-5 mr-1"></i>골프</a></li>
                                <li><a href="./best.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-crown w-5 mr-1"></i>베스트</a></li>
                                <li><a href="./theme.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-star w-5 mr-1"></i>테마여행</a></li>
                                <li><a href="./custom.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-user-check w-5 mr-1"></i>맞춤여행</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="font-bold text-base mb-4 text-primary flex items-center"><i class="fa-solid fa-suitcase-rolling mr-2"></i>준비</h3>
                            <ul class="space-y-3 text-sm">
                                <li><a href="./hotels.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-hotel w-5 mr-1"></i>호텔</a></li>
                                <li><a href="./tours-tickets.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-ticket-alt w-5 mr-1"></i>투어/입장권</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="font-bold text-base mb-4 text-primary flex items-center"><i class="fa-solid fa-gift mr-2"></i>혜택</h3>
                            <ul class="space-y-3 text-sm">
                                <li><a href="./benefits.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-calendar-check w-5 mr-1"></i>이달의 혜택</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="font-bold text-base mb-4 text-primary flex items-center"><i class="fa-solid fa-comments mr-2"></i>소통</h3>
                            <ul class="space-y-3 text-sm">
                                <li><a href="./community.html" class="hover:text-primary flex items-center"><i class="fa-solid fa-users w-5 mr-1"></i>커뮤니티</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-gray-100 mt-6 pt-4 text-center">
                        <a href="./packages.html" class="text-sm text-gray-500 hover:text-primary">전체 카테고리 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
                    </div>
                </div>
            </div>
        `;
        
        const dropdownContainer = document.createElement('div');
        dropdownContainer.innerHTML = dropdownHTML;
        categoryNav.querySelector('.relative').appendChild(dropdownContainer.firstElementChild);

        const dropdown = document.getElementById('all-menu-dropdown');

        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && !toggleButton.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }
}

/**
 * 전체 화면 메뉴 모달을 동적으로 생성합니다.
 * @param {HTMLElement} appElement - 모달을 추가할 최상위 app 요소
 */
function createFullScreenMenu(appElement) {
    const modalHTML = `
      <div id="full-menu-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[100] hidden items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] relative overflow-hidden flex flex-col">
            <div class="flex justify-between items-center p-6 border-b">
                <h2 class="text-2xl font-bold text-primary">전체 메뉴</h2>
                <button id="full-menu-close" class="text-gray-500 hover:text-gray-800 text-2xl"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-8 overflow-y-auto">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="font-bold text-lg mb-4 border-b pb-2">여행 찾기</h3>
                        <ul class="space-y-3">
                            <li><a href="./packages.html" class="hover:text-primary">해외여행</a></li>
                            <li><a href="./best.html" class="hover:text-primary">베스트</a></li>
                            <li><a href="./theme.html" class="hover:text-primary">테마여행</a></li>
                            <li><a href="./custom.html" class="hover:text-primary">맞춤여행</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-4 border-b pb-2">항공/호텔</h3>
                        <ul class="space-y-3">
                            <li><a href="./flights.html" class="hover:text-primary">항공</a></li>
                            <li><a href="./hotels.html" class="hover:text-primary">호텔</a></li>
                            <li><a href="./flights-hotels.html" class="hover:text-primary">항공+호텔</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-4 border-b pb-2">프로모션</h3>
                        <ul class="space-y-3">
                            <li><a href="./exhibitions.html" class="hover:text-primary">여행기획전</a></li>
                            <li><a href="./benefits.html" class="hover:text-primary">이달의 혜택</a></li>
                            <li><a href="./live.html" class="hover:text-primary">하나LIVE</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-4 border-b pb-2">기타</h3>
                        <ul class="space-y-3">
                            <li><a href="./tours-tickets.html" class="hover:text-primary">투어/입장권</a></li>
                            <li><a href="./domestic.html" class="hover:text-primary">국내여행</a></li>
                            <li><a href="./zeus.html" class="hover:text-primary">제우스</a></li>
                            <li><a href="./community.html" class="hover:text-primary">커뮤니티</a></li>
                            <li><a href="#" class="hover:text-primary">고객센터</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;
    appElement.insertAdjacentHTML('beforeend', modalHTML);
}

// 검색 폼 처리
function setupSearchForm() {
    // 데스크탑 검색폼 이벤트 위임
    document.body.addEventListener('submit', function(event) {
        // 폼 ID가 'search-form'인 경우에만 처리 (헤더 검색창)
        if (event.target.id === 'search-form') {
            event.preventDefault();
            const destinationInput = document.getElementById('destination');
            const query = destinationInput.value.trim();
            
            if (!query) {
                destinationInput.focus();
                return;
            }
            
            // 검색어와 일치하는 상품을 모든 상품 목록에서 찾습니다.
            const lowerCaseQuery = query.toLowerCase();
            const results = uniqueProducts.filter(pkg => 
                (pkg.name && pkg.name.toLowerCase().includes(lowerCaseQuery)) ||
                (pkg.destination && pkg.destination.toLowerCase().includes(lowerCaseQuery))
            );

            let targetPage = 'packages.html'; // 기본값: 해외여행

            // 검색 결과가 있고, 모든 결과가 동일한 카테고리에 속하는 경우
            if (results.length > 0) {
                const firstCategory = results[0].category;
                const allSameCategory = results.every(pkg => pkg.category === firstCategory);

                if (allSameCategory) {
                    switch (firstCategory) {
                        case 'domestic':
                            targetPage = 'domestic.html';
                            break;
                        case 'golf':
                            targetPage = 'golf.html';
                            break;
                        case 'hotel':
                            targetPage = 'hotels.html';
                            break;
                        case 'ticket':
                             targetPage = 'tours-tickets.html';
                             break;
                        case 'overseas':
                        default:
                            targetPage = 'packages.html';
                            break;
                    }
                }
                // 여러 카테고리가 섞여있으면 기본값(packages.html) 사용
            }
            
            // 결정된 페이지로 검색 쿼리와 함께 이동합니다.
            const queryParams = new URLSearchParams();
            queryParams.append('search', query);
            window.location.href = `${targetPage}?${queryParams.toString()}`;
        }
    });
    
    // 헤더 검색창에서 Enter 키 입력 처리
    const headerSearchInput = document.getElementById('destination');
    if (headerSearchInput) {
        headerSearchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                // form의 submit 이벤트를 발생시킵니다.
                document.getElementById('search-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        });
    }
}

/**
 * 페이지에 국가별 필터 버튼을 생성하고 이벤트를 설정합니다.
 * @param {string} pagePath - 현재 페이지의 경로
 * @param {Array} packages - 필터링할 상품 데이터 배열
 */
function setupCountryFilters(pagePath, packages) {
    const countryFiltersContainer = document.getElementById('country-filters');
    if (!countryFiltersContainer) return;

    // 모든 국가 목록을 추출합니다
    const countries = [...new Set(packages.flatMap(pkg => {
        if (!pkg.destination) return [];
        // 국가/지역 문자열을 '/' 또는 ',' 로 분리하고 첫 단어만 추출
        return pkg.destination.split(/[\/,]/).map(d => {
            const trimmed = d.trim();
            // 첫 번째 공백 이전의 단어만 사용 (예: '프랑스 파리' -> '프랑스')
            return trimmed.split(' ')[0];
        });
    }))].sort();

    // 현재 선택된 국가
    const urlParams = new URLSearchParams(window.location.search);
    const currentCountry = urlParams.get('country');    // 전체보기 버튼 생성
    let filtersHTML = `
        <a href="./${pagePath}" 
           class="whitespace-nowrap px-4 py-1.5 ${!currentCountry ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} 
                  hover:bg-primary hover:text-white rounded-full text-sm transition-colors">
            전체보기
        </a>
    `;

    // 각 국가별 버튼 생성
    countries.forEach(country => {
        const isActive = currentCountry === country;
        filtersHTML += `
            <a href="./${pagePath}?country=${encodeURIComponent(country)}" 
               class="whitespace-nowrap px-4 py-1.5 ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} 
                      hover:bg-primary hover:text-white rounded-full text-sm transition-colors">
                ${country}
            </a>
        `;
    });

    // HTML 삽입
    countryFiltersContainer.innerHTML = filtersHTML;
}

/**
 * 해외여행 페이지 전용 검색 폼 이벤트를 설정합니다.
 */
function setupCountrySearchForm() {
    const searchForm = document.getElementById('country-search-form');
    const searchInput = document.getElementById('country-search-input');

    if (!searchForm || !searchInput) {
        console.log('국가 검색 폼이나 입력란이 없습니다.');
        return;
    }

    console.log('국가 검색 폼 설정 중...');

    // URL에 검색어가 있으면 입력 필드에 채워넣습니다.
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        searchInput.value = decodeURIComponent(searchQuery);
        console.log(`URL에서 가져온 검색어: ${searchQuery}`);
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        console.log(`국가 검색어 제출: "${query}"`);
        
        const currentUrl = new URL(window.location.href);

        if (query) {
            currentUrl.searchParams.set('search', query);
            // 새로운 검색 시 기존 'country' 파라미터는 제거합니다.
            currentUrl.searchParams.delete('country');
        } else {
            // 검색어가 없으면 'search' 파라미터를 제거합니다.
            currentUrl.searchParams.delete('search');
        }
        
        // 변경된 URL로 페이지를 이동하여 검색 결과를 표시합니다.
        const redirectUrl = currentUrl.toString();
        console.log(`이동할 URL: ${redirectUrl}`);
        window.location.href = redirectUrl;
    });
}

/**
 * 현재 페이지에 해당하는 네비게이션 링크에 활성 스타일을 적용합니다.
 */
function activateCurrentNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('#main-categories a, #all-menu-dropdown a, #full-menu-modal a');
    navLinks.forEach(link => {
        // link.href가 절대 경로가 아닐 수 있으므로 new URL()로 정규화
        const linkPage = new URL(link.href).pathname.split('/').pop() || 'index.html';
        
        if (linkPage === currentPage) {
            link.classList.add('text-primary', 'font-bold');
            // 메인 카테고리 네비게이션에만 밑줄 추가
            if (link.closest('#main-categories')) {
                link.classList.add('border-b-2', 'border-primary');
            }
        }
    });
}


// --- 데이터 섹션 ---
// 데이터 선언 순서가 스크립트 실행에 중요하므로, 모든 개별 데이터 배열을 먼저 정의합니다.

// 메인 페이지 추천 패키지 데이터
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
        type: '패키지',
        category: 'overseas'
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
        type: '자유여행',
        category: 'overseas'
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
        type: '허니문',
        category: 'overseas'
    },
];

// 베스트 패키지 데이터
const bestPackages = [
    { id: 'b1', name: '[베스트] 스위스 일주 8일', destination: '스위스', image: 'https://images.unsplash.com/photo-1539035104074-dee66086b5e3?q=80&w=2070&auto=format&fit=crop', price: 3500000, rating: 4.9, days: 8, category: 'overseas' },
    { id: 'b2', name: '[베스트] 이탈리아 예술 기행 7일', destination: '이탈리아', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1966&auto=format&fit=crop', price: 3200000, rating: 4.8, days: 7, category: 'overseas' },
    { id: 'b3', name: '[베스트] 하와이 5성급 호텔 6일', destination: '미국', image: 'https://images.unsplash.com/photo-1562438087-234d62997a81?q=80&w=2070&auto=format&fit=crop', price: 4800000, rating: 5.0, days: 6, category: 'overseas' },
    { id: 'b4', name: '[베스트] 다낭 풀빌라 힐링 5일', destination: '베트남', image: 'https://images.unsplash.com/photo-1587740920993-c602b8357359?q=80&w=2070&auto=format&fit=crop', price: 1800000, rating: 4.8, days: 5, category: 'overseas' },
];

// 호텔 상품 데이터
const hotelDeals = [
    { id: 'h1', name: '[특가] 파리 시내 4성급 호텔 3박', destination: '프랑스 파리', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop', price: 890000, rating: 4.5, type: '호텔', category: 'hotel' },
    { id: 'h2', name: '[오션뷰] 몰디브 워터빌라 4박', destination: '몰디브', image: 'https://images.unsplash.com/photo-1515962282235-9644a8c3b333?q=80&w=2070&auto=format&fit=crop', price: 3500000, rating: 5.0, type: '리조트', category: 'hotel' },
    { id: 'h3', name: '[시티뷰] 뉴욕 타임스퀘어 호텔 2박', destination: '미국 뉴욕', image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=2070&auto=format&fit=crop', price: 1200000, rating: 4.7, type: '호텔', category: 'hotel' },
];

// 투어/입장권 데이터
const tourTickets = [
    { id: 't1', name: '로마 바티칸 박물관 우선 입장권', destination: '이탈리아 로마', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop', price: 75000, rating: 4.9, type: '입장권', category: 'ticket' },
    { id: 't2', name: '파리 세느강 디너 크루즈', destination: '프랑스 파리', image: 'https://images.unsplash.com/photo-1568080413514-a8960e33579b?q=80&w=2070&auto=format&fit=crop', price: 180000, rating: 4.8, type: '투어', category: 'ticket' },
    { id: 't3', name: '스위스 융프라우 VIP 패스', destination: '스위스 인터라켄', image: 'https://images.unsplash.com/photo-1567157577312-3b7a03239332?q=80&w=1974&auto=format&fit=crop', price: 250000, rating: 4.9, type: '패스', category: 'ticket' },
];

// 국내 숙소 데이터
const domesticAccommodations = [
    { id: 'da1', name: '제주 신라호텔', destination: '제주', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', price: 450000, rating: 4.9, type: '호텔', category: 'domestic' },
    { id: 'da2', name: '강릉 씨마크 호텔', destination: '강원 강릉', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop', price: 380000, rating: 4.8, type: '호텔', category: 'domestic' },
    { id: 'da3', name: '가평 까사32 풀빌라', destination: '경기 가평', image: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=2070&auto=format&fit=crop', price: 550000, rating: 4.7, type: '풀빌라', category: 'domestic' },
    { id: 'da4', name: '부산 파라다이스 호텔', destination: '부산', image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=2070&auto=format&fit=crop', price: 420000, rating: 4.8, type: '호텔', category: 'domestic' },
    { id: 'da5', name: '여수 소노캄 리조트', destination: '전남 여수', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop', price: 320000, rating: 4.6, type: '리조트', category: 'domestic' },
    { id: 'da6', name: '경주 힐튼 호텔', destination: '경북 경주', image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop', price: 280000, rating: 4.5, type: '호텔', category: 'domestic' },
];

// 테마여행 데이터
const themePackages = [
    { id: 'th1', name: '[미식] 일본 오사카 식도락 3일', destination: '일본 오사카', image: 'https://images.unsplash.com/photo-1554118811-2b45a1e5b1e2?q=80&w=2070&auto=format&fit=crop', price: 890000, rating: 4.8, days: 3, category: 'overseas' },
    { id: 'th2', name: '[예술] 프랑스 파리 미술관 투어 5일', destination: '프랑스 파리', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80', price: 2500000, rating: 4.9, days: 5, category: 'overseas' },
    { id: 'th3', name: '[휴양] 태국 코사무이 리조트 5일', destination: '태국 코사무이', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop', price: 1600000, rating: 4.7, days: 5, category: 'overseas' },
];

// 맞춤여행 데이터
const customPackages = [
    { id: 'ct1', name: '우리 가족 맞춤 유럽 10일', destination: '유럽', image: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?q=80&w=2070&auto=format&fit=crop', price: 0, rating: 5.0, type: '견적문의', category: 'overseas' },
    { id: 'ct2', name: '기업 연수/인센티브 투어', destination: '전세계', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', price: 0, rating: 5.0, type: '견적문의', category: 'overseas' },
    { id: 'ct3', name: '나만의 허니문 만들기', destination: '전세계', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1932&auto=format&fit=crop', price: 0, rating: 5.0, type: '견적문의', category: 'overseas' }
];

// 이달의 혜택 데이터
const monthlyBenefits = [
    { id: 'bn1', name: '[6월 특가] 동남아 인기 휴양지 모음', destination: '동남아', image: 'https://images.unsplash.com/photo-1537953773345-d172ccfa13c8?q=80&w=2070&auto=format&fit=crop', price: 899000, rating: 4.8, days: 5, discount: '15%', category: 'overseas' },
    { id: 'bn3', name: '[얼리버드] 미주/캐나다 단풍여행', destination: '미주/캐나다', image: 'https://images.unsplash.com/photo-1507525428034-b723a996f6ea?q=80&w=2070&auto=format&fit=crop', price: 4200000, rating: 4.9, days: 10, discount: '30만원', category: 'overseas' }
];

// 골프 패키지 데이터
const golfPackages = [
    { id: 'g1', name: '베트남 다낭 3색 골프 5일', destination: '베트남', image: 'https://images.unsplash.com/photo-1617993872223-b553dbaefd5f?q=80&w=1974&auto=format&fit=crop', price: 1790000, rating: 4.8, days: 5, category: 'golf' },
    { id: 'g2', name: '일본 오키나와 명품 골프 4일', destination: '일본', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop', price: 2100000, rating: 4.9, days: 4, category: 'golf' },
    { id: 'g3', name: '태국 파타야 무제한 라운딩 5일', destination: '태국', image: 'https://images.unsplash.com/photo-1587174486073-ae5e3c2c6a45?q=80&w=1932&auto=format&fit=crop', price: 1550000, rating: 4.7, days: 5, category: 'golf' },
    { id: 'g4', name: '미국 하와이 오아후 5색 골프 7일', destination: '미국', image: 'https://images.unsplash.com/photo-1570299434801-3315dbdd96b4?q=80&w=2070&auto=format&fit=crop', price: 4800000, rating: 4.9, days: 7, category: 'golf' },
    { id: 'g5', name: '사이판 월드클래스 골프 5일', destination: '사이판', image: 'https://images.unsplash.com/photo-1500930287589-c4f0c2c6c7e2?q=80&w=2070&auto=format&fit=crop', price: 1990000, rating: 4.8, days: 5, category: 'golf' },
    { id: 'g6', name: '스코틀랜드 세인트 앤드류스 순례 8일', destination: '영국', image: 'https://images.unsplash.com/photo-1562079956-5a9a654c4594?q=80&w=2070&auto=format&fit=crop', price: 7500000, rating: 5.0, days: 8, category: 'golf' }
];

// 동행자별 패키지 데이터
const companionPackages = [
    { id: 'c1', name: '우리 가족 첫 해외여행! 괌 PIC 5일', companion: '아이와 함께', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop', price: 1890000, rating: 4.8, days: 5, category: 'overseas' },
    { id: 'c2', name: '부모님과 효도여행, 베트남 하롱베이 4일', companion: '부모님과', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop', price: 1450000, rating: 4.9, days: 4, category: 'overseas' },
    { id: 'c3', name: '친구와 떠나는 방콕 미식탐방 5일', companion: '친구와', image: 'https://images.unsplash.com/photo-1563492065599-3520f775ee05?q=80&w=1974&auto=format&fit=crop', price: 990000, rating: 4.7, days: 5, category: 'overseas' },
    { id: 'c4', name: '연인과 로맨틱, 이탈리아 남부 7일', companion: '연인과', image: 'https://images.unsplash.com/photo-1562625964-ffe9b2f07925?q=80&w=1964&auto=format&fit=crop', price: 3200000, rating: 4.9, days: 7, category: 'overseas' },
    { id: 'c5', name: '나홀로 힐링, 교토 고즈넉한 료칸 4일', companion: '혼자서도', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop', price: 1650000, rating: 4.8, days: 4, category: 'overseas' },
    { id: 'c6', name: '반려동물과 함께, 제주도 애견동반 3일', companion: '반려동물과', image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop', price: 750000, rating: 4.7, days: 3, category: 'domestic' },
    { id: 'c7', name: '특별한 허니문, 몰디브 풀빌라 6일', companion: '허니문', image: 'https://images.unsplash.com/photo-1515962282235-9644a8c3b333?q=80&w=2070&auto=format&fit=crop', price: 5500000, rating: 5.0, days: 6, category: 'overseas' },
    { id: 'c8', name: '우리만의 프라이빗, 발리 독채 풀빌라 5일', companion: '우리끼리', image: 'https://images.unsplash.com/photo-1587740920993-c602b8357359?q=80&w=2070&auto=format&fit=crop', price: 2800000, rating: 4.9, days: 5, category: 'overseas' }
];

// 커뮤니티 게시글 데이터
const communityPosts = [
    { id: 'cm1', title: '이탈리아 7일 여행 후기입니다!', author: '여행가', date: '2024-06-20', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1966&auto=format&fit=crop', preview: '정말 꿈만 같았던 이탈리아 여행이었습니다. 콜로세움의 웅장함과 베네치아의 낭만은 잊을 수가 없네요. 여러분도 꼭 가보세요!', likes: 15, comments: 4 },
    { id: 'cm2', title: '스위스에서 인생샷 건지는 꿀팁', author: '사진작가', date: '2024-06-18', image: 'https://images.unsplash.com/photo-1539035104074-dee66086b5e3?q=80&w=2070&auto=format&fit=crop', preview: '융프라우에서 찍은 사진들 공유합니다. 아침 일찍 올라가면 사람이 없어서 좋아요. 삼각대는 필수!', likes: 32, comments: 8 },
    { id: 'cm3', title: '파리에서 소매치기 안 당하는 법', author: '안전제일', date: '2024-06-15', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80', preview: '사람 많은 곳에서는 가방을 꼭 앞으로 메고, 핸드폰은 손에 들고 다니지 마세요. 특히 몽마르뜨 언덕 조심!', likes: 55, comments: 12 },
    { id: 'cm4', title: '다낭 풀빌라 리얼 후기 (가족여행 강추)', author: '다낭사랑', date: '2024-06-12', image: 'https://images.unsplash.com/photo-1587740920993-c602b8357359?q=80&w=2070&auto=format&fit=crop', preview: '아이들과 함께 갔는데 정말 좋았어요. 프라이빗 비치도 있고, 룸서비스도 완벽했습니다. 재방문 의사 200%입니다.', likes: 28, comments: 6, content: '아이들과 함께하는 첫 해외여행이라 걱정이 많았는데, 다낭 풀빌라 덕분에 정말 편안하고 즐거운 시간을 보냈습니다. <br><br> 저희가 묵었던 곳은 프라이빗 비치가 바로 앞에 있어서 아이들이 안전하게 물놀이를 즐길 수 있었고, 룸서비스로 시켜 먹었던 음식들도 하나같이 다 맛있었어요. <br><br> 특히 직원분들이 모두 친절해서 감동이었습니다. 다음에 다낭에 또 가게 된다면 무조건 여기로 다시 올 거예요! 가족 여행 준비하시는 분들께 강력 추천합니다.' }
];

// 의존성을 가지는 데이터 배열을 모든 개별 데이터 선언 이후에 정의합니다.
// 전체 해외여행 패키지 데이터
const allTravelPackages = [
    { id: 'p1', name: '스페인/포르투갈 9일', destination: '스페인/포르투갈', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop', price: 3800000, rating: 4.7, days: 9, category: 'overseas' },
    { id: 'p2', name: '동유럽 4개국 8일', destination: '체코/오스트리아/헝가리', image: 'https://images.unsplash.com/photo-1562327949-d43826585363?q=80&w=2070&auto=format&fit=crop', price: 3100000, rating: 4.6, days: 8, category: 'overseas' },
    { id: 'p3', name: '북유럽 4개국 10일', destination: '노르웨이/스웨덴/핀란드/덴마크', image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=1974&auto=format&fit=crop', price: 5200000, rating: 4.8, days: 10, category: 'overseas' },
    ...travelPackages
];

// 모든 상품 데이터를 하나로 합치고 중복을 제거하여 관리합니다.
// 상세 페이지 등에서 모든 상품을 검색할 수 있도록 통합 데이터를 생성합니다.
const allProducts = [
    ...travelPackages, ...bestPackages, ...allTravelPackages, ...hotelDeals,
    ...tourTickets, ...domesticAccommodations, ...themePackages, ...customPackages,
    ...monthlyBenefits, ...golfPackages, ...companionPackages
];

const uniqueProducts = allProducts.reduce((acc, current) => {
    if (!acc.find(item => item.id === current.id)) {
        acc.push(current);
    }
    return acc;
}, []);


// --- 컨텐츠 표시 함수 ---

/**
 * 패키지 목록을 컨테이너에 렌더링하고, 결과가 없을 경우 메시지를 표시합니다.
 * @param {HTMLElement} container - 패키지 카드를 담을 컨테이너 요소
 * @param {Array} packages - 표시할 패키지 데이터 배열
 * @param {string} pageTitle - 동적으로 변경할 페이지의 기본 제목
 * @param {string} [filterTerm] - 필터링된 국가 또는 검색어 (옵션)
 */
function renderPackages(container, packages, pageTitle, filterTerm) {
    const noResults = document.getElementById('no-results');

    if (filterTerm) {
        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.querySelector('#page-title + p');
        if (titleEl) titleEl.textContent = `'${filterTerm}' ${pageTitle} 상품`;
        if (subtitleEl) subtitleEl.textContent = `K-Travel이 엄선한 '${filterTerm}' 관련 상품들을 만나보세요.`;
    }

    if (packages && packages.length > 0) {
        container.innerHTML = packages.map(createPackageCard).join('');
        container.classList.remove('hidden');
        if (noResults) noResults.classList.add('hidden');
    } else {
        container.innerHTML = '';
        container.classList.add('hidden');
        if (noResults) noResults.classList.remove('hidden');
    }
}

/**
 * URL 쿼리 파라미터를 기반으로 패키지를 필터링하고, 지정된 카테고리에 해당하는 상품만 반환합니다.
 * @param {Array} allPackages - 필터링할 전체 상품 배열 (uniqueProducts)
 * @param {string} pageCategory - 이 페이지에서 표시할 상품 카테고리 (e.g., 'overseas', 'domestic', 'golf')
 * @returns {{filtered: Array, filterTerm: string|null}} 필터링된 패키지와 필터링에 사용된 단어
 */
function filterPackagesByUrl(allPackages, pageCategory) {
    console.log(`filterPackagesByUrl 호출됨 (카테고리: ${pageCategory})`);
    
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get('country');
    const searchQuery = urlParams.get('search');
    const type = urlParams.get('type');
    const checkin = urlParams.get('checkin');

    console.log('URL 파라미터:', { country, searchQuery, type, checkin });

    let filtered = allPackages;
    let filterTerm = null;

    // 1. 이 페이지의 카테고리에 해당하는 상품만 먼저 필터링합니다.
    if (pageCategory) {
        filtered = filtered.filter(pkg => pkg.category === pageCategory);
    }

    // 2. URL 쿼리 파라미터로 추가 필터링합니다.
    // 'search' 쿼리가 'country' 쿼리보다 우선순위를 가집니다.
    if (searchQuery) {
        filterTerm = searchQuery;
        const lowerCaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(pkg => {
            const nameMatch = pkg.name && pkg.name.toLowerCase().includes(lowerCaseQuery);
            const destinationMatch = pkg.destination && pkg.destination.toLowerCase().includes(lowerCaseQuery);
            return nameMatch || destinationMatch;
        });
        console.log(`검색어 "${searchQuery}"(으)로 카테고리 '${pageCategory}' 내에서 필터링 후 상품 수:`, filtered.length);
    } else if (country) {
        filterTerm = country;
        filtered = filtered.filter(pkg => pkg.destination && pkg.destination.includes(country));
        console.log(`국가 "${country}"(으)로 카테고리 '${pageCategory}' 내에서 필터링 후 상품 수:`, filtered.length);
    }

    // 숙소 유형으로 필터링
    if (type) {
        const prevCount = filtered.length;
        filtered = filtered.filter(pkg => pkg.type === type);
        console.log(`숙소 유형 "${type}"로 필터링 후 상품 수: ${filtered.length} (이전: ${prevCount})`);
    }
    
    // 체크인 날짜 필터링 (국내숙소 페이지용)
    if (checkin) {
        filterTerm = filterTerm ? `${filterTerm} (${checkin} 체크인)` : `${checkin} 체크인`;
        console.log(`체크인 날짜 "${checkin}" 필터 적용됨`);
    }
    
    console.log('최종 필터링된 상품 수:', filtered.length);
    console.log('필터 용어:', filterTerm);
    
    return { filtered, filterTerm };
}

// 패키지 카드 HTML 생성 (재사용)
function createPackageCard(pkg) {
    const location = pkg.destination || pkg.companion;
    const priceDisplay = pkg.price > 0 ? `₩${formatPrice(pkg.price)}~` : pkg.type;
    const badge = pkg.discount ? `<span class="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">${pkg.discount} 할인</span>` : '';

    return `
    <div class="bg-white rounded-xl shadow-subtle overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in relative">
        ${badge}
        <a href="package-detail.html?id=${pkg.id}" class="block">
            <div class="h-56 bg-cover bg-center" style="background-image: url('${pkg.image}')"></div>
            <div class="p-6">
                <div class="flex justify-between items-center text-sm text-text-light mb-2">
                    <span>${location}</span>
                    ${pkg.days ? `<span><i class="far fa-clock mr-1"></i>${pkg.days}일</span>` : (pkg.type ? `<span>${pkg.type}</span>` : '')}
                </div>
                <h3 class="text-lg font-bold text-text mb-4 h-14 overflow-hidden">${pkg.name}</h3>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-primary">${priceDisplay}</span>
                    <div class="flex items-center text-sm text-text-light">
                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                        <span>${pkg.rating}</span>
                    </div>
                </div>
            </div>
        </a>
    </div>
    `;
}

// 커뮤니티 게시글 카드 HTML 생성
function createCommunityPostCard(post) {
    return `
    <div class="bg-white rounded-xl shadow-subtle overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in">
        <a href="community-detail.html?id=${post.id}" class="block">
            <div class="h-56 bg-cover bg-center" style="background-image: url('${post.image}')"></div>
            <div class="p-6">
                <h3 class="text-lg font-bold text-text mb-2 h-14 overflow-hidden">${post.title}</h3>
                <p class="text-sm text-text-light mb-4 h-20 overflow-hidden">${post.preview}</p>
                <div class="flex justify-between items-center text-xs text-gray-500 border-t pt-4">
                    <span class="font-medium text-gray-700">by ${post.author}</span>
                    <span class="text-gray-500">${post.date}</span>
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center"><i class="far fa-heart mr-1.5"></i>${post.likes}</span>
                        <span class="flex items-center"><i class="far fa-comment mr-1.5"></i>${post.comments}</span>
                    </div>
                </div>
            </div>
        </a>
    </div>
    `;
}

// 메인 페이지 추천 패키지 표시
function displayPopularPackages() {
    const packagesContainer = document.getElementById('popular-packages');
    if (packagesContainer) {
        const popularPackages = travelPackages.slice(0, 3);
        packagesContainer.innerHTML = popularPackages.map((pkg, index) => {
            const cardHTML = createPackageCard(pkg);
            // fade-in-up 애니메이션을 위해 div로 감싸고 delay 추가
            return `<div class="fade-in-up" style="animation-delay: ${index * 100}ms">${cardHTML}</div>`;
        }).join('');
    }
}

// 골프 패키지 표시
function displayGolfPackages() {
    const container = document.getElementById('package-list');
    if (!container) return;
    const { filtered, filterTerm } = filterPackagesByUrl(uniqueProducts, 'golf');
    renderPackages(container, filtered, '골프', filterTerm);
}

// 동행자별 패키지 표시
function displayCompanionPackages() {
    const container = document.getElementById('companion-package-list');
    if (!container) return;
    container.innerHTML = companionPackages.map(createPackageCard).join('');
}

// 베스트 패키지 표시
function displayBestPackages() {
    const container = document.getElementById('package-list');
    if (!container) return;
    const { filtered, filterTerm } = filterPackagesByUrl(uniqueProducts, 'overseas');
    renderPackages(container, filtered, '베스트', filterTerm);
}

// 전체 해외여행 패키지 표시
function displayAllTravelPackages() {
    const container = document.getElementById('package-list');
    if (!container) return;
    const { filtered, filterTerm } = filterPackagesByUrl(uniqueProducts, 'overseas');
    renderPackages(container, filtered, '해외여행', filterTerm);
}

// 호텔 상품 표시
function displayHotelDeals() {
    const container = document.getElementById('package-list');
    if (!container) return;
    const { filtered, filterTerm } = filterPackagesByUrl(uniqueProducts, 'hotel');
    renderPackages(container, filtered, '호텔', filterTerm);
}

// 투어/입장권 표시
function displayTourTickets() {
    const container = document.getElementById('package-list');
    if (!container) return;
    const { filtered, filterTerm } = filterPackagesByUrl(uniqueProducts, 'ticket');
    renderPackages(container, filtered, '투어/입장권', filterTerm);
}

// 국내숙소 표시 (필터링 로직 포함)
function displayDomesticAccommodations() {
    const container = document.getElementById('package-list');
    if (!container) return;
    const { filtered, filterTerm } = filterPackagesByUrl(uniqueProducts, 'domestic');
    renderPackages(container, filtered, '국내숙소', filterTerm);
}

// 테마여행 패키지 표시
function displayThemePackages() {
    const container = document.getElementById('package-list');
    if (!container) return;
    const { filtered, filterTerm } = filterPackagesByUrl(uniqueProducts, 'overseas');
    renderPackages(container, filtered, '테마여행', filterTerm);
}

// 맞춤여행 상품 표시
function displayCustomPackages() {
    const container = document.getElementById('package-list');
    if (!container) return;
    container.innerHTML = customPackages.map(createPackageCard).join('');
}

// 이달의 혜택 표시
function displayMonthlyBenefits() {
    const container = document.getElementById('package-list');
    if (!container) return; // container가 없으면 함수 종료

    const noResults = document.getElementById('no-results');

    if (monthlyBenefits && monthlyBenefits.length > 0) {
        const packagesHTML = monthlyBenefits.map(createPackageCard).join('');
        container.innerHTML = packagesHTML;
        container.classList.remove('hidden');
        if (noResults) {
            noResults.classList.add('hidden');
        }
    } else {
        container.innerHTML = ''; // 상품이 없으면 비웁니다.
        container.classList.add('hidden');
        if (noResults) {
            noResults.classList.remove('hidden');
        }
    }
}

// 커뮤니티 게시글 표시
function displayCommunityPosts() {
    const container = document.getElementById('community-post-list');
    if (container) {
        const postsHTML = communityPosts.map(createCommunityPostCard).join('');
        container.innerHTML = postsHTML;
    }
}

// 커뮤니티 게시글 상세 표시
function displayCommunityPostDetail() {
    const container = document.getElementById('post-detail-content');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const post = communityPosts.find(p => p.id === postId);

    if (post) {
        const postHTML = `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="w-full h-96 object-cover">
                <div class="p-8 md:p-12">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${post.title}</h1>
                    <div class="flex items-center text-sm text-gray-500 mb-6 pb-6 border-b">
                        <span>작성자: <span class="font-semibold text-gray-700">${post.author}</span></span>
                        <span class="mx-3">|</span>
                        <span>작성일: ${post.date}</span>
                    </div>
                    <div class="prose max-w-none text-lg text-gray-800 leading-relaxed">
                        ${post.content || post.preview} 
                    </div>

                    <div class="mt-10 pt-6 border-t flex justify-between items-center">
                        <div class="flex items-center space-x-6">
                            <button class="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                                <i class="far fa-heart text-xl"></i>
                                <span class="font-semibold">좋아요 ${post.likes}</span>
                            </button>
                            <button class="flex items-center space-x-2 text-gray-600 hover:text-primary">
                                <i class="far fa-comment text-xl"></i>
                                <span class="font-semibold">댓글 ${post.comments}</span>
                            </button>
                        </div>
                        <a href="/community.html" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">목록으로</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = postHTML;
    } else {
        container.innerHTML = `<p class="text-center text-xl py-20">게시글을 찾을 수 없습니다.</p>`;
    }
}

// 상품 상세 정보 표시
function displayPackageDetail() {
    const container = document.getElementById('package-detail-content');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    
    const product = uniqueProducts.find(p => p.id === packageId);

    if (product) {
        document.title = `${product.name} | K-Travel`; // 페이지 제목 업데이트

        const priceDisplay = product.price > 0 ? `₩${formatPrice(product.price)}~` : '견적문의';
        const description = product.description || '상세 정보가 준비중입니다. 담당자에게 문의해주세요.';

        const detailHTML = `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
                <div class="h-64 md:h-96 bg-cover bg-center" style="background-image: url('${product.image}')"></div>
                <div class="p-6 md:p-10">
                    <div class="md:flex justify-between items-start">
                        <div class="md:w-2/3">
                            <span class="text-sm text-primary font-semibold">${product.destination || product.companion || '여행'}</span>
                            <h1 class="text-3xl md:text-4xl font-bold text-text mt-2 mb-4">${product.name}</h1>
                            <div class="flex items-center text-text-light mb-6 pb-6 border-b">
                                <div class="flex items-center">
                                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                                    <span>${product.rating}</span>
                                </div>
                                ${product.days ? `<span class="mx-3">|</span><span>${product.days}일</span>` : ''}
                                ${product.type ? `<span class="mx-3">|</span><span class="bg-primary-light text-primary text-xs font-semibold px-2 py-1 rounded-full">${product.type}</span>` : ''}
                            </div>
                            <div class="prose max-w-none text-base text-text-light leading-relaxed">
                                <h2 class="text-2xl font-bold text-text mb-4">상품 소개</h2>
                                <p>${description}</p>
                            </div>
                        </div>
                        <div class="md:w-1/3 md:pl-10 mt-8 md:mt-0">
                            <div class="bg-background-alt p-6 rounded-lg shadow-subtle sticky top-28">
                                <h2 class="text-2xl font-bold text-primary mb-4">${priceDisplay}</h2>
                                <p class="text-sm text-text-light mb-6">1인 기준 금액입니다.</p>
                                <a href="booking.html?packageName=${encodeURIComponent(product.name)}" class="w-full block text-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg">
                                    ${product.price > 0 ? '예약하기' : '견적 문의하기'}
                                </a>
                                <div class="flex justify-center space-x-4 mt-6">
                                    <button class="text-gray-500 hover:text-primary"><i class="fas fa-heart mr-1"></i> 찜하기</button>
                                    <button class="text-gray-500 hover:text-primary"><i class="fas fa-share-alt mr-1"></i> 공유하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = detailHTML;
    } else {
        container.innerHTML = `
            <div class="text-center py-20">
                <h1 class="text-2xl font-bold">상품 정보를 찾을 수 없습니다.</h1>
                <p class="text-text-light mt-2">요청하신 상품이 존재하지 않거나, 현재 판매가 중단되었습니다.</p>
                <a href="/" class="mt-6 inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">홈으로 돌아가기</a>
            </div>
        `;
    }
}

/**
 * 숫자를 통화 형식(세 자리마다 쉼표)으로 변환합니다.
 * @param {number} price - 변환할 숫자
 * @returns {string} 통화 형식의 문자열
 */
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 카테고리별 드롭다운 메뉴를 설정하고 클릭 이벤트를 처리합니다.
 */
function setupCategoryDropdowns() {
    const createDropdownContent = (elementId, packages, pageUrl) => {
        const dropdownContainer = document.getElementById(elementId);
        if (!dropdownContainer) return;

        const destinations = [...new Set(packages.flatMap(pkg => {
            if (!pkg.destination) return [];
            return pkg.destination.split(/[/,]/).map(d => d.trim().split(' ')[0]);
        }))].sort();

        const link = dropdownContainer.parentElement.querySelector('a');
        const arrow = link.querySelector('i');

        if (destinations.length === 0) {
            if (arrow) arrow.style.display = 'none';
            return;
        }

        const dropdownHTML = `
            <div class="p-2 max-h-60 overflow-y-auto">
                <ul class="space-y-1 text-sm">
                   
                                      
                    <li><a href="${pageUrl}" class="block px-3 py-2 rounded-md hover:bg-gray-100 font-bold text-primary">✈️ 전체보기</a></li>
                    ${destinations.map(dest => `
                        <li>
                            <a href="${pageUrl}?country=${encodeURIComponent(dest)}" class="block px-3 py-2 rounded-md hover:bg-gray-100">${dest}</a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        dropdownContainer.innerHTML = dropdownHTML;
    };

    createDropdownContent('best-dropdown', bestPackages, '/best.html');
    createDropdownContent('packages-dropdown', allTravelPackages, '/packages.html');
    createDropdownContent('hotels-dropdown', hotelDeals, '/hotels.html');
    createDropdownContent('tours-tickets-dropdown', tourTickets, '/tours-tickets.html');
    createDropdownContent('domestic-dropdown', domesticAccommodations, '/domestic.html');
    createDropdownContent('golf-dropdown', golfPackages, '/golf.html');
    createDropdownContent('theme-dropdown', themePackages, '/theme.html');

    // 드롭다운 토글을 위한 통합 이벤트 리스너
    document.addEventListener('click', (e) => {
        const categoryLink = e.target.closest('.relative.group > a');
        const isClickInsideDropdown = e.target.closest('[id$="-dropdown"]');

        // 드롭다운 내부의 링크를 클릭한 경우, 기본 동작을 허용하고 함수를 종료합니다.
        if (isClickInsideDropdown) {
            return;
        }

        const allDropdowns = document.querySelectorAll('[id$="-dropdown"]');
        let targetDropdown = null;

        if (categoryLink) {
            e.preventDefault(); 
            const group = categoryLink.parentElement;
            targetDropdown = group.querySelector('[id$="-dropdown"]');
        }

        allDropdowns.forEach(dropdown => {
            if (dropdown === targetDropdown && dropdown.classList.contains('hidden')) {
                dropdown.classList.remove('hidden');
            } else {
                dropdown.classList.add('hidden');
            }
        });
    });
}

/**
 * 국내숙소 페이지의 추가 필터(유형, 날짜)를 설정합니다.
 */
function setupDomesticFilters() {
    const typeFilter = document.getElementById('type-filter');
    const checkinFilter = document.getElementById('checkin-filter');
    const filterBtn = document.getElementById('filter-btn');
    
    if (!typeFilter || !checkinFilter || !filterBtn) return;
    
    // URL에서 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const currentType = urlParams.get('type');
    const currentCheckin = urlParams.get('checkin');
    
    // 필터 초기값 설정
    if (currentType) {
        typeFilter.value = currentType;
    }
    
    if (currentCheckin) {
        checkinFilter.value = currentCheckin;
    }
    
    // 필터 버튼 클릭 이벤트
    filterBtn.addEventListener('click', () => {
        const currentUrl = new URL(window.location.href);
        
        // 숙소 유형 필터
        if (typeFilter.value) {
            currentUrl.searchParams.set('type', typeFilter.value);
        } else {
            currentUrl.searchParams.delete('type');
        }
        
        // 체크인 날짜 필터
        if (checkinFilter.value) {
            currentUrl.searchParams.set('checkin', checkinFilter.value);
        } else {
            currentUrl.searchParams.delete('checkin');
        }
        
        // 페이지 이동
        window.location.href = currentUrl.toString();
    });
}

/**
 * 메인 페이지 전용 검색 폼을 설정합니다. 
 * 정확한 상품명과 일치하면 상세 페이지로, 그렇지 않으면 검색 결과 페이지로 이동합니다.
 */
function setupMainSearchForm() {
    console.log('메인 검색 폼 설정 함수 호출됨');
    
    const mainSearchForm = document.getElementById('index-search-form');
    if (!mainSearchForm) {
        console.error('메인 검색 폼을 찾을 수 없습니다 (id: index-search-form)');
        return;
    }
     
    console.log('메인 검색 폼 발견됨:', mainSearchForm);
    mainSearchForm.addEventListener('submit', function(event) {
         event.preventDefault();
        console.log('메인 검색 폼 제출 이벤트 발생');
         
        const mainDestination = document.getElementById('index-destination');
        if (!mainDestination) {
            console.error('검색 입력 필드를 찾을 수 없습니다 (id: index-destination)');
            return;
        }
         
        const destination = mainDestination.value.trim();
        const travelTypeElement = document.getElementById('index-travel-type');
        const travelType = travelTypeElement ? travelTypeElement.value : '';
         
        if (!destination) {
             mainDestination.focus();
             return;
         }
        
         console.log('검색 정보:', { destination, travelType });
         
         // 정확한 상품명과 일치하는지 확인합니다.
         const exactMatch = uniqueProducts.find(product => 
             product.name && product.name.toLowerCase() === destination.toLowerCase()
         );
         
         if (exactMatch) {
             // 정확한 일치가 있으면 상품 상세 페이지로 직접 이동합니다.
            console.log(`정확한 일치 상품 발견: ${exactMatch.id} - ${exactMatch.name}`);
            window.location.href = `package-detail.html?id=${exactMatch.id}`;
         } else {
             // 일치하는 상품이 없으면 검색 결과 페이지로 이동합니다.
             const queryParams = new URLSearchParams();
            queryParams.append('search', destination);
            if (travelType) {
                queryParams.append('type', travelType);
            }
            const url = `packages.html?${queryParams.toString()}`;
            console.log(`검색 결과 페이지로 이동: ${url}`);
            window.location.href = url;
         }
     });
    
    console.log('메인 검색 폼 이벤트 리스너가 설정되었습니다');
}