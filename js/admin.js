document.addEventListener('DOMContentLoaded', function() {
    console.log("관리자 페이지 스크립트 시작");

    // 인증 체크
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        const password = prompt("관리자 비밀번호를 입력하세요:", "");
        if (password === "admin123") {
            localStorage.setItem('adminLoggedIn', 'true');
        } else {
            alert("비밀번호가 틀렸습니다.");
            document.body.innerHTML = `<div class="p-8 text-center text-red-500">접근이 거부되었습니다.</div>`;
            return;
        }
    }

    // HTML 내부 스크립트에서 menuCategories가 재정의되어 있을 수 있으므로 여기서 명시적으로 다시 정의
    console.log("메뉴 카테고리 데이터 설정 시작");
    window.menuCategories = [
        {
            name: "베스트",
            url: "best.html",
            order: "1",
            sub: [
                { name: "유럽", order: "1" },
                { name: "아시아", order: "2" },
                { name: "미국", order: "3" },
                { name: "오세아니아", order: "4" }
            ]
        },
        {
            name: "해외여행",
            url: "packages.html",
            order: "2",
            sub: [
                { name: "가족 여행", order: "1" },
                { name: "신혼 여행", order: "2" },
                { name: "친구 여행", order: "3" },
                { name: "단체 여행", order: "4" }
            ]
        },
        {
            name: "호텔",
            url: "hotels.html",
            order: "3",
            sub: [
                { name: "5성급 호텔", order: "1" },
                { name: "리조트", order: "2" },
                { name: "풀빌라", order: "3" }
            ]
        },
        {
            name: "투어/입장권",
            url: "tours-tickets.html",
            order: "4",
            sub: [
                { name: "명소 입장권", order: "1" },
                { name: "액티비티", order: "2" },
                { name: "시티투어", order: "3" }
            ]
        },
        {
            name: "국내숙소",
            url: "domestic.html",
            order: "5",
            sub: [
                { name: "제주도", order: "1" },
                { name: "부산", order: "2" },
                { name: "강원도", order: "3" },
                { name: "경상도", order: "4" }
            ]
        },
        {
            name: "골프",
            url: "golf.html",
            order: "6",
            sub: [
                { name: "국내 골프", order: "1" },
                { name: "해외 골프", order: "2" }
            ]
        },
        {
            name: "테마여행",
            url: "theme.html",
            order: "7",
            sub: [
                { name: "크루즈", order: "1" },
                { name: "사파리", order: "2" },
                { name: "투어", order: "3" }
            ]
        },
        {
            name: "맞춤여행",
            url: "custom.html",
            order: "8",
            sub: [
                { name: "개인 맞춤", order: "1" },
                { name: "기업 맞춤", order: "2" }
            ]
        },
        {
            name: "이달의 혜택",
            url: "benefits.html",
            order: "9",
            sub: [
                { name: "특가 상품", order: "1" },
                { name: "시즌 혜택", order: "2" }
            ]
        }
    ];

    // 필요한 요소 가져오기
    const pageTitle = document.getElementById('page-title');
    const sections = document.querySelectorAll('.admin-section');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    // 각 링크에 클릭 이벤트 추가
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSectionId = this.getAttribute('data-section');
            if (!targetSectionId) return;
            
            // 모든 섹션 숨기기
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // 모든 네비게이션 링크 비활성화
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // 선택된 섹션 보이기
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // 선택된 네비게이션 링크 활성화
            this.classList.add('active');
            
            // 페이지 타이틀 업데이트
            if (this.querySelector('span')) {
                pageTitle.textContent = this.querySelector('span').textContent;
            }
            
            // 카테고리 관리 섹션인 경우 특별 처리
            if (targetSectionId === 'categories-section') {
                initCategoryTabs();
            }
        });
    });

    // 카테고리 관리 섹션 내부 탭 초기화
    function initCategoryTabs() {
        const menuCatBtn = document.getElementById('menu-cat-btn');
        const countryCatBtn = document.getElementById('country-cat-btn');
        const menuCategorySection = document.getElementById('menu-category-section');
        const countryCategorySection = document.getElementById('country-category-section');
        
        if (!menuCatBtn || !countryCatBtn || !menuCategorySection || !countryCategorySection) {
            console.error("카테고리 탭 요소를 찾을 수 없습니다.");
            return;
        }
        
        // 기본값 - 메뉴 카테고리 탭 활성화
        menuCategorySection.classList.remove('hidden');
        countryCategorySection.classList.add('hidden');
        
        menuCatBtn.classList.add('border-blue-600', 'text-blue-600');
        menuCatBtn.classList.remove('border-transparent', 'text-gray-500');
        
        countryCatBtn.classList.remove('border-blue-600', 'text-blue-600');
        countryCatBtn.classList.add('border-transparent', 'text-gray-500');
        
        // 하위 탭 이벤트 설정
        setupCategoryTabEvents();
        
        // 메뉴 카테고리 리스트 렌더링
        console.log("카테고리 탭 초기화 - renderMenu 호출");
        console.log("window.menuCategories 상태:", window.menuCategories);
        
        // HTML에 정의된 menuCategories 덮어쓰기 방지
        if (!window.menuCategories || !Array.isArray(window.menuCategories) || window.menuCategories.length === 0) {
            console.warn("window.menuCategories가 비어있거나 배열이 아닙니다. 재설정합니다.");
            // 앞에서 정의한 메뉴 카테고리 재설정
            window.menuCategories = [
                {
                    name: "베스트",
                    url: "best.html",
                    order: "1",
                    sub: [
                        { name: "유럽", order: "1" },
                        { name: "아시아", order: "2" },
                        { name: "미국", order: "3" },
                        { name: "오세아니아", order: "4" }
                    ]
                },
                // ... 다른 카테고리들은 생략
            ];
        }
        
        renderMenu(); // 항상 호출
    }

    // 각 카테고리 탭에 이벤트 설정
    function setupCategoryTabEvents() {
        const menuCatBtn = document.getElementById('menu-cat-btn');
        const countryCatBtn = document.getElementById('country-cat-btn');
        const countryTabBtn = document.getElementById('country-tab-btn');
        const cityTabBtn = document.getElementById('city-tab-btn');
        
        const menuCategorySection = document.getElementById('menu-category-section');
        const countryCategorySection = document.getElementById('country-category-section');
        const countryManagement = document.getElementById('country-management');
        const cityManagement = document.getElementById('city-management');
        
        // 메뉴 카테고리 탭 클릭
        menuCatBtn.addEventListener('click', function() {
            menuCategorySection.classList.remove('hidden');
            countryCategorySection.classList.add('hidden');
            
            this.classList.add('border-blue-600', 'text-blue-600');
            this.classList.remove('border-transparent', 'text-gray-500');
            
            countryCatBtn.classList.remove('border-blue-600', 'text-blue-600');
            countryCatBtn.classList.add('border-transparent', 'text-gray-500');
        });
        
        // 국가/지역 카테고리 탭 클릭
        countryCatBtn.addEventListener('click', function() {
            menuCategorySection.classList.add('hidden');
            countryCategorySection.classList.remove('hidden');
            
            this.classList.add('border-blue-600', 'text-blue-600');
            this.classList.remove('border-transparent', 'text-gray-500');
            
            menuCatBtn.classList.remove('border-blue-600', 'text-blue-600');
            menuCatBtn.classList.add('border-transparent', 'text-gray-500');
            
            // 국가/지역 섹션 내부 탭 기본값
            countryManagement.classList.remove('hidden');
            cityManagement.classList.add('hidden');
            
            countryTabBtn.classList.add('border-blue-600', 'text-blue-600');
            countryTabBtn.classList.remove('border-transparent', 'text-gray-500');
            
            cityTabBtn.classList.remove('border-blue-600', 'text-blue-600');
            cityTabBtn.classList.add('border-transparent', 'text-gray-500');
        });
        
        // 국가 관리 탭 클릭
        countryTabBtn.addEventListener('click', function() {
            countryManagement.classList.remove('hidden');
            cityManagement.classList.add('hidden');
            
            this.classList.add('border-blue-600', 'text-blue-600');
            this.classList.remove('border-transparent', 'text-gray-500');
            
            cityTabBtn.classList.remove('border-blue-600', 'text-blue-600');
            cityTabBtn.classList.add('border-transparent', 'text-gray-500');
        });
        
        // 도시 관리 탭 클릭
        cityTabBtn.addEventListener('click', function() {
            cityManagement.classList.remove('hidden');
            countryManagement.classList.add('hidden');
            
            this.classList.add('border-blue-600', 'text-blue-600');
            this.classList.remove('border-transparent', 'text-gray-500');
            
            countryTabBtn.classList.remove('border-blue-600', 'text-blue-600');
            countryTabBtn.classList.add('border-transparent', 'text-gray-500');
        });
    }

    // 메뉴 카테고리 & 서브카테고리 관리
    const menuForm = document.getElementById('menu-category-form');
    const menuList = document.getElementById('menu-category-list');
    // menuCategories는 이제 전역 변수로 사용
    let editIdx = null;

    function renderMenu() {
        console.log("renderMenu 함수 호출됨");
        
        if (!menuList) {
            console.error("menuList 요소를 찾을 수 없습니다.");
            const menuCategoryList = document.getElementById('menu-category-list');
            if (!menuCategoryList) {
                console.error("menu-category-list 요소도 찾을 수 없습니다. 렌더링을 중단합니다.");
                return;
            }
            console.log("menuList 대신 menu-category-list 사용");
            menuList = menuCategoryList;
        }
        
        // 현재 열린 서브메뉴 상태 저장
        const openSubMenus = [];
        document.querySelectorAll('tr[id^="sub-"]').forEach(row => {
            if (!row.classList.contains('hidden')) {
                openSubMenus.push(row.id);
                console.log(`열린 서브메뉴 저장: ${row.id}`);
            }
        });
        
        console.log("메뉴 카테고리 렌더링:", window.menuCategories);
        
        // 테이블 초기화
        menuList.innerHTML = '';
        
        if (!window.menuCategories || !Array.isArray(window.menuCategories) || window.menuCategories.length === 0) {
            console.error("window.menuCategories가 비어있거나 배열이 아닙니다.");
            // 기본 데이터 설정
            window.menuCategories = [
                {
                    name: "베스트",
                    url: "best.html",
                    order: "1",
                    sub: [
                        { name: "유럽", order: "1" },
                        { name: "아시아", order: "2" },
                        { name: "미국", order: "3" },
                        { name: "오세아니아", order: "4" }
                    ]
                },
                {
                    name: "해외여행",
                    url: "packages.html",
                    order: "2",
                    sub: [
                        { name: "가족 여행", order: "1" },
                        { name: "신혼 여행", order: "2" },
                        { name: "친구 여행", order: "3" },
                        { name: "단체 여행", order: "4" }
                    ]
                },
            ];
            console.log("기본 메뉴 카테고리 데이터를 설정했습니다:", window.menuCategories);
        }

        // 각 카테고리 행 생성
        window.menuCategories.forEach((cat, i) => {
            // 메인 카테고리 행
            const tr = document.createElement('tr');
            tr.className = 'menu-category-row';
            tr.innerHTML = `
                <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">${cat.order}</td>
                <td class="px-3 py-4 text-sm text-gray-500">${cat.name}</td>
                <td class="px-3 py-4 text-sm text-gray-500">${cat.url}</td>
                <td class="py-4 pl-3 pr-4 text-right text-sm font-medium">
                  <button data-i="${i}" class="edit-menu text-blue-600 hover:text-blue-900 cursor-pointer px-2 py-1 rounded border border-blue-200 hover:bg-blue-50">수정</button>
                  <button data-i="${i}" class="del-menu text-red-600 hover:text-red-900 ml-1 cursor-pointer px-2 py-1 rounded border border-red-200 hover:bg-red-50">삭제</button>
                  <button data-i="${i}" class="toggle-sub text-green-600 hover:text-green-900 ml-1 cursor-pointer px-2 py-1 rounded border border-green-200 hover:bg-green-50">
                    서브 <span class="inline-block">${cat.sub?.length ? '('+cat.sub.length+')' : ''}</span>
                  </button>
                </td>
            `;
            menuList.appendChild(tr);
            
            // 서브카테고리 행 (처음에는 숨김)
            const subTr = document.createElement('tr');
            subTr.id = `sub-${i}`;
            subTr.classList.add('hidden'); // hidden 클래스로 숨김 (display: none)
            
            // 서브카테고리 내용 구성
            let subContent = `
            <td colspan="4" class="p-4 bg-gray-50">
                <div class="mb-4">
                    <h4 class="font-medium mb-3 text-blue-700">"${cat.name}" 서브카테고리</h4>
                    <div id="sub-list-${i}" class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">`;
            
            // 서브카테고리 아이템 추가
            if (cat.sub && cat.sub.length > 0) {
                cat.sub.forEach((s, si) => {
                    subContent += `
                        <div class="flex items-center justify-between py-2 px-3 bg-white rounded shadow-sm border border-gray-200">
                            <span class="font-medium">${s.name} <span class="text-gray-500 text-xs">순서: ${s.order}</span></span>
                            <div>
                                <button data-ci="${i}" data-si="${si}" class="edit-sub text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded border border-blue-200 hover:bg-blue-50">수정</button>
                                <button data-ci="${i}" data-si="${si}" class="del-sub text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50">삭제</button>
                            </div>
                        </div>`;
                });
            } else {
                subContent += `<div class="text-gray-500 italic p-4 bg-white rounded">서브카테고리가 없습니다.</div>`;
            }
            
            // 서브카테고리 추가 폼
            subContent += `
                    </div>
                    <div class="bg-white p-4 rounded shadow-sm border border-blue-100">
                        <h5 class="text-sm font-medium text-gray-700 mb-2">새 서브카테고리 추가</h5>
                        <form id="sub-form-${i}" class="flex flex-wrap gap-3">
                            <div class="flex-1">
                                <label class="block text-xs text-gray-700 mb-1">서브 메뉴 이름</label>
                                <input type="text" placeholder="이름" required class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div class="w-24">
                                <label class="block text-xs text-gray-700 mb-1">순서</label>
                                <input type="number" placeholder="순서" required class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div class="flex items-end">
                                <button type="submit" class="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">추가</button>
                            </div>
                        </form>
                    </div>
                </div>
            </td>`;
            
            subTr.innerHTML = subContent;
            menuList.appendChild(subTr);
        });
        
        // 이벤트 핸들러 추가
        // 카테고리 수정 버튼
        menuList.querySelectorAll('.edit-menu').forEach(btn => {
            btn.onclick = function() {
                const i = this.dataset.i;
                editIdx = i;
                const cat = window.menuCategories[i];
                document.getElementById('menu-category-name').value = cat.name;
                document.getElementById('menu-category-url').value = cat.url;
                document.getElementById('menu-category-order').value = cat.order;
                window.scrollTo(0, 0); // 수정 폼으로 스크롤
            };
        });
        
        // 카테고리 삭제 버튼
        menuList.querySelectorAll('.del-menu').forEach(btn => {
            btn.onclick = function() {
                if (confirm('이 메뉴와 모든 서브메뉴를 삭제하시겠습니까?')) {
                    const i = this.dataset.i;
                    window.menuCategories.splice(i, 1);
                    renderMenu();
                }
            };
        });
        
        // 서브카테고리 토글 버튼
        menuList.querySelectorAll('.toggle-sub').forEach(btn => {
            btn.onclick = function() {
                const i = this.dataset.i;
                const subRow = document.getElementById(`sub-${i}`);
                
                if(!subRow) {
                    console.error(`서브 카테고리 행을 찾을 수 없음: sub-${i}`);
                    return;
                }
                
                const isHidden = subRow.classList.contains('hidden');
                
                // 토글 상태 변경
                if (isHidden) {
                    subRow.classList.remove('hidden');
                } else {
                    subRow.classList.add('hidden');
                }
                
                // 버튼 스타일 변경
                if (isHidden) {
                    this.classList.add('bg-green-100');
                    this.classList.add('font-medium');
                } else {
                    this.classList.remove('bg-green-100');
                    this.classList.remove('font-medium');
                }
                
                // 스크롤 이동
                if (isHidden) {
                    console.log("서브 카테고리 영역으로 스크롤");
                    setTimeout(() => {
                        subRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            };
        });
        
        // 서브카테고리 추가 폼 이벤트
        window.menuCategories.forEach((cat, i) => {
            const form = document.getElementById(`sub-form-${i}`);
            if (!form) {
                console.error(`서브 카테고리 폼을 찾을 수 없음: sub-form-${i}`);
                return;
            }
            
            form.onsubmit = function(e) {
                e.preventDefault();
                console.log(`서브 카테고리 폼 제출 처리: sub-form-${i}`);
                
                const [nameInput, orderInput] = this.querySelectorAll('input');
                const name = nameInput.value.trim();
                const order = orderInput.value.trim();
                
                if (!name || !order) {
                    alert('이름과 순서를 모두 입력해주세요.');
                    return;
                }
                
                if (!cat.sub) cat.sub = [];
                cat.sub.push({ name, order });
                
                // 추가 성공 메시지
                alert(`새 서브 카테고리 "${name}" 추가 완료`);
                
                nameInput.value = '';
                orderInput.value = '';
                
                // 위치 기억
                const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                renderMenu();
                
                // 작업 완료 후 약간 지연시켜 DOM이 업데이트될 시간을 줌
                setTimeout(() => {
                    // 서브카테고리 영역 열기
                    const subRow = document.getElementById(`sub-${i}`);
                    if (subRow) {
                        subRow.classList.remove('hidden');
                        
                        // 스크롤 위치 복원 후 서브 영역으로 스크롤
                        window.scrollTo(0, scrollPosition);
                        subRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // 토글 버튼 스타일 업데이트
                        const toggleBtn = document.querySelector(`.toggle-sub[data-i="${i}"]`);
                        if (toggleBtn) {
                            toggleBtn.classList.add('bg-green-100');
                            toggleBtn.classList.add('font-medium');
                        }
                    } else {
                        console.error(`서브 카테고리 행을 찾을 수 없음: sub-${i}`);
                    }
                }, 100);
            };
        });
        
        // 서브카테고리 수정 버튼
        menuList.querySelectorAll('.edit-sub').forEach(btn => {
            btn.onclick = function() {
                const ci = this.dataset.ci;
                const si = this.dataset.si;
                
                if (!window.menuCategories[ci] || !window.menuCategories[ci].sub || !window.menuCategories[ci].sub[si]) {
                    console.error('수정할 서브 카테고리를 찾을 수 없습니다.');
                    return;
                }
                
                const subItem = window.menuCategories[ci].sub[si];
                
                const newName = prompt('서브 메뉴 이름:', subItem.name);
                if (newName === null) return;
                
                const newOrder = prompt('순서:', subItem.order);
                if (newOrder === null) return;
                
                if (newName.trim()) subItem.name = newName;
                if (newOrder.trim()) subItem.order = newOrder;
                
                // 수정 성공 메시지
                alert(`서브 카테고리 "${subItem.name}"가 수정되었습니다.`);
                
                // 현재 스크롤 위치 저장
                const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                renderMenu();
                
                setTimeout(() => {
                    // 서브카테고리 영역 열기
                    const subRow = document.getElementById(`sub-${ci}`);
                    if (subRow) {
                        subRow.classList.remove('hidden');
                        
                        // 스크롤 위치 복원
                        window.scrollTo(0, scrollPosition);
                        
                        // 토글 버튼 스타일 업데이트
                        const toggleBtn = document.querySelector(`.toggle-sub[data-i="${ci}"]`);
                        if (toggleBtn) {
                            toggleBtn.classList.add('bg-green-100');
                            toggleBtn.classList.add('font-medium');
                        }
                    }
                }, 100);
            };
        });
        
        // 서브카테고리 삭제 버튼
        menuList.querySelectorAll('.del-sub').forEach(btn => {
            btn.onclick = function() {
                const ci = this.dataset.ci;
                const si = this.dataset.si;
                
                if (!window.menuCategories[ci] || !window.menuCategories[ci].sub || !window.menuCategories[ci].sub[si]) {
                    console.error('삭제할 서브 카테고리를 찾을 수 없습니다.');
                    return;
                }
                
                const subName = window.menuCategories[ci].sub[si].name;
                
                if (confirm(`서브 카테고리 "${subName}"를 삭제하시겠습니까?`)) {
                    window.menuCategories[ci].sub.splice(si, 1);
                    
                    // 현재 스크롤 위치 저장
                    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                    
                    renderMenu();
                    
                    setTimeout(() => {
                        // 서브카테고리 영역 열기
                        const subRow = document.getElementById(`sub-${ci}`);
                        if (subRow) {
                            subRow.classList.remove('hidden');
                            
                            // 스크롤 위치 복원
                            window.scrollTo(0, scrollPosition);
                            
                            // 토글 버튼 스타일 업데이트
                            const toggleBtn = document.querySelector(`.toggle-sub[data-i="${ci}"]`);
                            if (toggleBtn) {
                                toggleBtn.classList.add('bg-green-100');
                                toggleBtn.classList.add('font-medium');
                            }
                        }
                    }, 100);
                }
            };
        });
        
        // 이전에 열려있던 서브메뉴 다시 열기
        openSubMenus.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.remove('hidden');
                
                // 토글 버튼도 활성화 상태로 만들기
                const index = id.replace('sub-', '');
                const toggleBtn = document.querySelector(`.toggle-sub[data-i="${index}"]`);
                if (toggleBtn) {
                    toggleBtn.classList.add('bg-green-100');
                    toggleBtn.classList.add('font-medium');
                }
            }
        });
    }

    menuForm.onsubmit = function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('menu-category-name');
        const urlInput = document.getElementById('menu-category-url');
        const orderInput = document.getElementById('menu-category-order');
        
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const order = orderInput.value.trim();
        
        if (!name || !url || !order) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        if (editIdx !== null) {
            window.menuCategories[editIdx] = { 
                ...window.menuCategories[editIdx], 
                name, 
                url, 
                order 
            };
            editIdx = null;
        } else {
            window.menuCategories.push({ name, url, order, sub: [] });
        }
        
        this.reset();
        renderMenu();
    };

    // 로그아웃 버튼 이벤트 설정
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            alert('로그아웃 되었습니다.');
            window.location.href = 'index.html';
        });
    }

    // 기본 섹션 보이기 & 카테고리 초기화
    console.log("관리자 페이지 초기화 중...");
    
    // 메뉴 카테고리 데이터 다시 출력해서 확인
    console.log("최종 window.menuCategories 값:", window.menuCategories);
    
    // 테스트를 위해 메뉴 렌더링 직접 호출 (디버깅용)
    if (typeof renderMenu === 'function') {
        console.log("테스트를 위한 렌더링 직접 호출");
        setTimeout(function() {
            renderMenu();
        }, 100);
    }

    // URL 해시로 섹션 표시 (우선순위 높음)
    const hash = window.location.hash.substring(1); // # 제거
    if (hash) {
        const sectionId = hash;
        const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (navLink) {
            console.log(`해시에 따라 섹션 활성화: ${sectionId}`);
            navLink.click();
        }
    }
    // 그 외에는 기본 대시보드 표시
    else {
        // 테스트를 위해 카테고리 섹션 활성화
        const categoriesLink = document.querySelector('.nav-link[data-section="categories-section"]');
        if (categoriesLink) {
            console.log("카테고리 관리 섹션 자동 활성화 (테스트용)");
            setTimeout(function() {
                categoriesLink.click();
                
                // 추가 렌더링 테스트 코드
                setTimeout(function() {
                    console.log("추가 렌더링 시도");
                    if (typeof renderMenu === 'function') {
                        renderMenu();
                    }
                }, 500);
            }, 300);
        } else {
            const defaultLink = document.querySelector('.nav-link[data-section="dashboard-section"]');
            if (defaultLink) {
                defaultLink.classList.add('active');
            }
        }
    }
    
    // 페이지가 로드된 후 카테고리 테이블 강제 렌더링
    setTimeout(() => {
        const menuList = document.getElementById('menu-category-list');
        if (menuList && window.menuCategories && window.menuCategories.length > 0) {
            console.log("페이지 로드 후 카테고리 강제 렌더링");
            renderMenu();
        }
    }, 500);
    
    console.log("관리자 페이지 초기화 완료");
});
