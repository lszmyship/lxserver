const API_BASE = '';

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const app = document.getElementById('app');
    const passwordInput = document.getElementById('access-password');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');

    const userSelection = document.getElementById('user-selection');
    const usersList = document.getElementById('users-list');
    const dashboardContent = document.getElementById('dashboard-content');
    const currentUserDisplay = document.getElementById('current-user-display');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if already logged in
    const sessionToken = localStorage.getItem('lx_auth');
    if (sessionToken) {
        showApp();
        fetchUsers();
    }

    loginBtn.addEventListener('click', async () => {
        const password = passwordInput.value;
        if (!password) return;

        try {
            const res = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('lx_auth', password);
                showApp();
                fetchUsers();
            } else {
                loginError.textContent = '密码错误';
            }
        } catch (err) {
            loginError.textContent = '登录请求失败';
            console.error(err);
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('lx_auth');
        location.reload();
    });

    function showApp() {
        loginOverlay.classList.add('hidden');
        app.classList.remove('hidden');
    }

    async function fetchUsers() {
        const password = localStorage.getItem('lx_auth');
        try {
            const res = await fetch(`${API_BASE}/api/users`, {
                headers: { 'X-Frontend-Auth': password }
            });
            if (res.status === 401) {
                handleAuthError();
                return;
            }
            const users = await res.json();
            renderUsers(users);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    }

    function renderUsers(users) {
        if (!users || !users.length) {
            usersList.innerHTML = '<p>暂无用户</p>';
            return;
        }

        usersList.innerHTML = users.map(user => `
            <div class="user-card" onclick="selectUser('${user.name}')">
                <h3>${user.name}</h3>
            </div>
        `).join('');
    }

    window.selectUser = function (username) {
        currentUserDisplay.textContent = `当前用户: ${username}`;
        userSelection.classList.add('hidden');
        dashboardContent.classList.remove('hidden');
        loadData(username);
    };

    function handleAuthError() {
        alert('认证失效，请重新登录');
        localStorage.removeItem('lx_auth');
        location.reload();
    }

    async function loadData(username) {
        const password = localStorage.getItem('lx_auth');
        if (!username || !password) return;

        try {
            const res = await fetch(`${API_BASE}/api/data?user=${encodeURIComponent(username)}`, {
                headers: {
                    'X-Frontend-Auth': password
                }
            });

            if (res.status === 401) {
                handleAuthError();
                return;
            }

            const data = await res.json();
            renderData(data);
        } catch (err) {
            console.error('Failed to load data', err);
        }
    }

    function renderData(data) {
        if (!data || !data.length) {
            document.getElementById('total-lists').textContent = '0';
            document.getElementById('total-songs').textContent = '0';
            document.getElementById('lists-content').innerHTML = '<p>暂无数据</p>';
            return;
        }

        let totalSongs = 0;
        const listsHtml = data.map(list => {
            // Assuming list structure from LX Music
            const songCount = list.list ? list.list.length : 0;
            totalSongs += songCount;
            return `
                <div class="list-item">
                    <div class="list-name">${list.name || '未命名歌单'}</div>
                    <div class="list-count">${songCount} 首歌曲</div>
                    <div class="list-count">ID: ${list.id}</div>
                </div>
            `;
        }).join('');

        document.getElementById('total-lists').textContent = data.length;
        document.getElementById('total-songs').textContent = totalSongs;
        document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
        document.getElementById('lists-content').innerHTML = listsHtml;
    }
});
