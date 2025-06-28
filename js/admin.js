import '../src/index.css';

document.addEventListener('DOMContentLoaded', function () {
    const adminPageContainer = document.getElementById('admin-page-container');
    
    // 무조건 관리자 페이지 표시 (비밀번호 확인 없이)
    showAdminPage(adminPageContainer);
    
    /* 원래 코드 - 비밀번호 확인
    // Check login status
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPage(adminPageContainer);
    } else {
        const password = prompt("관리자 비밀번호를 입력하세요:", "");
        if (password === "admin123") {
            localStorage.setItem('adminLoggedIn', 'true');
            showAdminPage(adminPageContainer);
        } else {
            alert("비밀번호가 틀렸습니다.");
            document.body.innerHTML = `<div class="p-8 text-center text-red-500">접근이 거부되었습니다.</div>`;
        }
    }
    */
});

function showAdminPage(container) {
    // Show the main container by removing the 'hidden' class
    container.classList.remove('hidden');

    // Attach all necessary event listeners
    setupEventListeners();
    
    // Show the initial dashboard content
    const dashboardContent = document.getElementById('dashboard-content');
    if (dashboardContent) {
        dashboardContent.classList.remove('hidden');
    }
    
    // Ensure the main pages are visible
    document.getElementById('admin-page-container').style.display = 'block';
}

function setupEventListeners() {
    const navLinks = document.querySelectorAll('#admin-nav .nav-link');
    const pageTitle = document.getElementById('page-title');
    const logoutButton = document.getElementById('logout-button');
    const mobileMenuButton = document.getElementById('mobile-menu-button'); // Assuming this might exist
    const sidebar = document.getElementById('admin-sidebar');

    // --- Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-target');
            if (!targetId) {
                return; // Not a content switching link (e.g., logout, go to site)
            }
            e.preventDefault();
            
            // Update active link style
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Update page title
            pageTitle.textContent = this.textContent.trim();

            // Switch content view
            const contentContainers = document.querySelectorAll('.admin-page-container');
            contentContainers.forEach(container => {
                container.classList.add('hidden');
            });
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                targetContainer.classList.remove('hidden');
            }

            // Close mobile sidebar if open and a choice is made
            if (sidebar && sidebar.classList.contains('flex')) { // Assuming mobile uses flex to show
                sidebar.classList.remove('flex');
                sidebar.classList.add('hidden');
            }
        });
    });

    // --- Logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            window.location.reload();
        });
    }

    // --- Mobile Menu Toggle ---
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('flex');
        });
    }

    // --- Category Management ---
    const categoryForm = document.getElementById('category-form');
    const categoryNameInput = document.getElementById('category-name');
    const categoryIdInput = document.getElementById('category-id');
    const categoryListContainer = document.getElementById('category-list');
    const categoryCancelButton = document.getElementById('category-cancel');

    if (categoryForm) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [
            { id: 1, name: '해외여행' },
            { id: 2, name: '호텔' },
            { id: 3, name: '투어/입장권' }
        ];

        function renderCategories() {
            if (!categoryListContainer) return;
            categoryListContainer.innerHTML = categories.map(cat => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span>${cat.name}</span>
                    <div class="space-x-2">
                        <button class="text-blue-500 hover:text-blue-700 edit-btn" data-id="${cat.id}" data-name="${cat.name}">수정</button>
                        <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${cat.id}">삭제</button>
                    </div>
                </div>
            `).join('');
        }

        function saveCategories() {
            localStorage.setItem('categories', JSON.stringify(categories));
        }

        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = categoryNameInput.value.trim();
            const id = categoryIdInput.value;
            if (!name) return;

            if (id) { // Edit
                categories = categories.map(c => c.id == id ? { ...c, name } : c);
            } else { // Add
                const newCategory = { id: Date.now(), name };
                categories.push(newCategory);
            }
            saveCategories();
            renderCategories();
            categoryForm.reset();
            categoryIdInput.value = '';
            categoryCancelButton.classList.add('hidden');
        });

        categoryListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                categoryNameInput.value = e.target.dataset.name;
                categoryIdInput.value = e.target.dataset.id;
                categoryCancelButton.classList.remove('hidden');
                categoryNameInput.focus();
            } else if (e.target.classList.contains('delete-btn')) {
                if (confirm('정말 삭제하시겠습니까?')) {
                    categories = categories.filter(c => c.id != e.target.dataset.id);
                    saveCategories();
                    renderCategories();
                }
            }
        });

        categoryCancelButton.addEventListener('click', () => {
            categoryForm.reset();
            categoryIdInput.value = '';
            categoryCancelButton.classList.add('hidden');
        });

        renderCategories();
    }

    // --- Footer Information Management ---
    const footerForm = document.getElementById('footer-form');
    if (footerForm) {
        const fields = {
            'ceo': 'footer-ceo',
            'businessNumber': 'footer-business-number',
            'reportNumber': 'footer-report-number',
            'tourismNumber': 'footer-tourism-number',
            'address': 'footer-address',
            'contact': 'footer-contact',
            'contactHours': 'footer-contact-hours'
        };

        // Load existing data
        const savedData = JSON.parse(localStorage.getItem('footerData')) || {};
        for (const key in fields) {
            const input = document.getElementById(fields[key]);
            if (input) {
                input.value = savedData[key] || '';
            }
        }

        footerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {};
            for (const key in fields) {
                const input = document.getElementById(fields[key]);
                if (input) {
                    data[key] = input.value.trim();
                }
            }
            localStorage.setItem('footerData', JSON.stringify(data));
            alert('푸터 정보가 저장되었습니다.');
        });
    }
}
