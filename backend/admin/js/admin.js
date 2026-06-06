const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('adminToken');

// Check authentication
if (!token && !window.location.href.includes('login.html')) {
    window.location.href = 'login.html';
}

// Set auth header
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

// Load dashboard data
async function loadDashboard() {
    try {
        // Load stats
        const [postsRes, messagesRes, subscribersRes] = await Promise.all([
            fetch(`${API_URL}/blog`, { headers }),
            fetch(`${API_URL}/contact`, { headers }),
            fetch(`${API_URL}/newsletter`, { headers })
        ]);
        
        const posts = await postsRes.json();
        const messages = await messagesRes.json();
        const subscribers = await subscribersRes.json();
        
        document.getElementById('totalPosts').textContent = posts.pagination?.total || 0;
        document.getElementById('totalMessages').textContent = messages.data?.length || 0;
        document.getElementById('totalSubscribers').textContent = subscribers.count || 0;
        
        // Load recent messages
        if (messages.data) {
            const tbody = document.getElementById('messagesTableBody');
            tbody.innerHTML = messages.data.slice(0, 5).map(msg => `
                <tr>
                    <td>${msg.name}</td>
                    <td>${msg.email}</td>
                    <td>${msg.subject}</td>
                    <td>${new Date(msg.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }
        
        // Load recent posts
        if (posts.data) {
            const tbody = document.getElementById('postsTableBody');
            tbody.innerHTML = posts.data.slice(0, 5).map(post => `
                <tr>
                    <td>${post.title}</td>
                    <td>${post.category_name}</td>
                    <td>${post.views || 0}</td>
                    <td>${new Date(post.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }
        
        // Display admin name
        const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        document.getElementById('adminName').textContent = user.username || 'Admin';
        
        // Update date/time
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
    } catch (error) {
        console.error('Load dashboard error:', error);
    }
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('dateTime').textContent = now.toLocaleString();
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
});

// Load page if on dashboard
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/admin/')) {
    loadDashboard();
}