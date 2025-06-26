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

    // localStorage에서 데이터 불러오기를 시도하고, 없으면 기본값 사용
    const savedCategories = localStorage.getItem('menuCategories');
    if (savedCategories) {
        window.menuCategories = JSON.parse(savedCategories);
    } else {
        // 기본 메뉴 데이터
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
    }

    const pageTitle = document.getElementById('page-title');
    const sections = document.querySelectorAll('.admin-section');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    function showSection(targetSectionId) {
        if (!targetSectionId) return;

        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        const activeLink = document.querySelector(`.nav-link[data-section="${targetSectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            if (activeLink.querySelector('span')) {
                pageTitle.textContent = activeLink.querySelector('span').textContent;
            }
        }

        if (targetSectionId === 'categories-section') {
            initCategoryTabs();
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSectionId = this.getAttribute('data-section');
            window.location.hash = targetSectionId;
            showSection(targetSectionId);
        });
    });

    function initCategoryTabs() {
        const menuCatBtn = document.getElementById('menu-cat-btn');
        if (menuCatBtn.classList.contains('initialized')) return;

        const countryCatBtn = document.getElementById('country-cat-btn');
        const menuCategorySection = document.getElementById('menu-category-section');
        const countryCategorySection = document.getElementById('country-category-section');

        const switchTab = (activeBtn, inactiveBtn, activeSection, inactiveSection) => {
            activeSection.classList.remove('hidden');
            inactiveSection.classList.add('hidden');
            activeBtn.classList.add('border-blue-600', 'text-blue-600');
            activeBtn.classList.remove('border-transparent', 'text-gray-500');
            inactiveBtn.classList.remove('border-blue-600', 'text-blue-600');
            inactiveBtn.classList.add('border-transparent', 'text-gray-500');
        };

        menuCatBtn.addEventListener('click', () => switchTab(menuCatBtn, countryCatBtn, menuCategorySection, countryCategorySection));
        countryCatBtn.addEventListener('click', () => switchTab(countryCatBtn, menuCatBtn, countryCategorySection, menuCategorySection));
        
        menuCatBtn.classList.add('initialized');
        countryCatBtn.classList.add('initialized');

        renderMenu();
    }

    const menuForm = document.getElementById('menu-category-form');
    const menuList = document.getElementById('menu-category-list');
    let editIdx = null;

    // 변경된 메뉴 데이터를 localStorage에 저장하고 다시 렌더링하는 함수
    function saveAndRenderMenu() {
        // 저장하기 전에 순서(order)에 따라 정렬
        window.menuCategories.sort((a, b) => a.order - b.order);
        window.menuCategories.forEach(cat => {
            if (cat.sub && cat.sub.length > 0) {
                cat.sub.sort((a, b) => a.order - b.order);
            }
        });

        localStorage.setItem('menuCategories', JSON.stringify(window.menuCategories));
        renderMenu();
    }

    function renderMenu() {
        const openSubMenuId = document.querySelector('tr[id^="sub-"]:not(.hidden)')?.id;
        
        menuList.innerHTML = '';

        window.menuCategories.forEach((cat, i) => {
            const tr = document.createElement('tr');
            tr.className = 'menu-category-row';
            tr.innerHTML = `
                <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">${cat.order}</td>
                <td class="px-3 py-4 text-sm text-gray-500">${cat.name}</td>
                <td class="px-3 py-4 text-sm text-gray-500">${cat.url}</td>
                <td class="py-4 pl-3 pr-4 text-right text-sm font-medium">
                  <button data-i="${i}" class="edit-menu text-blue-600 hover:text-blue-900">수정</button>
                  <button data-i="${i}" class="del-menu text-red-600 hover:text-red-900 ml-2">삭제</button>
                  <button data-i="${i}" class="toggle-sub text-green-600 hover:text-green-900 ml-2">
                    서브 관리 <span class="text-xs">(${cat.sub?.length || 0})</span>
                  </button>
                </td>
            `;
            menuList.appendChild(tr);

            const subTr = document.createElement('tr');
            subTr.id = `sub-${i}`;
            subTr.className = 'hidden';
            subTr.innerHTML = createSubCategoryView(cat, i);
            menuList.appendChild(subTr);
        });

        if (openSubMenuId) {
            const subMenuToReopen = document.getElementById(openSubMenuId);
            if (subMenuToReopen) {
                subMenuToReopen.classList.remove('hidden');
                const index = openSubMenuId.split('-')[1];
                const toggleBtn = document.querySelector(`.toggle-sub[data-i="${index}"]`);
                if(toggleBtn) toggleBtn.classList.add('font-bold', 'text-green-700');
            }
        }
    }

    function createSubCategoryView(cat, catIndex) {
        const subItemsHTML = cat.sub && cat.sub.length > 0
            ? cat.sub.map((s, si) => `
                <div class="flex items-center justify-between p-2 bg-white border rounded-md">
                    <span class="font-medium">${s.name} (순서: ${s.order})</span>
                    <div>
                        <button data-ci="${catIndex}" data-si="${si}" class="edit-sub text-blue-500 hover:text-blue-700 text-sm">수정</button>
                        <button data-ci="${catIndex}" data-si="${si}" class="del-sub text-red-500 hover:text-red-700 text-sm ml-2">삭제</button>
                    </div>
                </div>`).join('')
            : '<div class="text-gray-500 p-2">서브카테고리가 없습니다.</div>';

        return `
            <td colspan="4" class="p-4 bg-gray-50">
                <h4 class="font-bold mb-2 text-lg">"${cat.name}" 서브카테고리 관리</h4>
                <div id="sub-list-${catIndex}" class="space-y-2 mb-4">${subItemsHTML}</div>
                <form id="sub-form-${catIndex}" class="bg-white p-3 rounded-md border">
                    <h5 class="font-semibold text-gray-700 mb-2">새 서브카테고리 추가</h5>
                    <div class="flex items-end gap-2">
                        <div class="flex-grow">
                            <label class="block text-xs text-gray-600 mb-1">이름</label>
                            <input type="text" placeholder="예: 유럽" required class="w-full p-2 border rounded-md">
                        </div>
                        <div class="w-24">
                            <label class="block text-xs text-gray-600 mb-1">순서</label>
                            <input type="number" placeholder="예: 1" required class="w-full p-2 border rounded-md">
                        </div>
                        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">추가</button>
                    </div>
                </form>
            </td>`;
    }

    function handleMenuClick(e) {
        const target = e.target;
        const i = target.dataset.i;
        const ci = target.dataset.ci;
        const si = target.dataset.si;

        if (target.matches('.edit-menu')) {
            editIdx = i;
            const cat = window.menuCategories[i];
            document.getElementById('menu-category-name').value = cat.name;
            document.getElementById('menu-category-url').value = cat.url;
            document.getElementById('menu-category-order').value = cat.order;
            document.getElementById('menu-form-title').textContent = "메뉴 카테고리 수정";
            document.getElementById('menu-form-submit').textContent = "수정하기";
            window.scrollTo(0, menuForm.offsetTop);
        } else if (target.matches('.del-menu')) {
            if (confirm(`'${window.menuCategories[i].name}' 메뉴를 삭제하시겠습니까? 모든 하위 카테고리도 함께 삭제됩니다.`)) {
                window.menuCategories.splice(i, 1);
                saveAndRenderMenu();
            }
        } else if (target.matches('.toggle-sub')) {
            const subRow = document.getElementById(`sub-${i}`);
            const isHidden = subRow.classList.toggle('hidden');
            target.classList.toggle('font-bold', !isHidden);
            target.classList.toggle('text-green-700', !isHidden);
            if (!isHidden) {
                subRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (target.matches('.edit-sub')) {
            const item = window.menuCategories[ci].sub[si];
            const container = target.closest('.flex');
            container.innerHTML = `
                <input type="text" value="${item.name}" class="flex-grow p-2 border rounded-md">
                <input type="number" value="${item.order}" class="w-20 p-2 border rounded-md mx-2">
                <button data-ci="${ci}" data-si="${si}" class="save-sub bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">저장</button>
                <button data-ci="${ci}" data-si="${si}" class="cancel-sub bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 ml-1">취소</button>
            `;
        } else if (target.matches('.del-sub')) {
            if (confirm(`'${window.menuCategories[ci].sub[si].name}' 서브카테고리를 삭제하시겠습니까?`)) {
                window.menuCategories[ci].sub.splice(si, 1);
                saveAndRenderMenu();
            }
        } else if (target.matches('.save-sub')) {
            const container = target.closest('.flex');
            const [nameInput, orderInput] = container.querySelectorAll('input');
            window.menuCategories[ci].sub[si] = { name: nameInput.value, order: orderInput.value };
            saveAndRenderMenu();
        } else if (target.matches('.cancel-sub')) {
            renderMenu();
        }
    }

    menuList.addEventListener('click', handleMenuClick);

    menuForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('menu-category-name').value.trim();
        const url = document.getElementById('menu-category-url').value.trim();
        const order = document.getElementById('menu-category-order').value.trim();

        if (!name || !url || !order) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        const newCategory = { name, url, order };
        if (editIdx !== null) {
            window.menuCategories[editIdx] = { ...window.menuCategories[editIdx], ...newCategory };
        } else {
            newCategory.sub = [];
            window.menuCategories.push(newCategory);
        }
        
        editIdx = null;
        menuForm.reset();
        document.getElementById('menu-form-title').textContent = "새 메뉴 카테고리 추가";
        document.getElementById('menu-form-submit').textContent = "추가하기";
        saveAndRenderMenu();
    });
    
    document.getElementById('menu-form-cancel').addEventListener('click', () => {
        editIdx = null;
        menuForm.reset();
        document.getElementById('menu-form-title').textContent = "새 메뉴 카테고리 추가";
        document.getElementById('menu-form-submit').textContent = "추가하기";
    });

    menuList.addEventListener('submit', e => {
        if (e.target.matches('[id^="sub-form-"]')) {
            e.preventDefault();
            const form = e.target;
            const catIndex = form.id.split('-')[2];
            const [nameInput, orderInput] = form.querySelectorAll('input');
            const name = nameInput.value.trim();
            const order = orderInput.value.trim();

            if (!name || !order) {
                alert('이름과 순서를 모두 입력해주세요.');
                return;
            }

            const category = window.menuCategories[catIndex];
            if (!category.sub) category.sub = [];
            category.sub.push({ name, order });
            
            saveAndRenderMenu();
        }
    });

    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        alert('로그아웃 되었습니다.');
        window.location.href = 'index.html';
    });

    // 초기화
    const hash = window.location.hash.substring(1);
    const initialSection = hash || 'dashboard-section';
    showSection(initialSection);
    
    console.log("관리자 페이지 초기화 완료");
});
