const API_URL = 'http://localhost:8000/api';
let tasks = [];
let categories = [];
let currentFilter = 'all';
let useLocalStorage = false;

// Theme
const initTheme = () => {
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
};

document.getElementById('themeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// API Check
const checkAPI = async () => {
    try {
        const res = await fetch(`${API_URL}/tasks/`);
        if (res.ok) {
            document.getElementById('apiStatus').classList.remove('hidden');
            useLocalStorage = false;
            return true;
        }
    } catch (e) {
        console.log('API offline, utilisation LocalStorage');
        useLocalStorage = true;
        document.getElementById('apiStatus').innerHTML = '<span class="w-2 h-2 rounded-full bg-orange-500"></span><span class="text-gray-600 dark:text-gray-400">Mode Local</span>';
        document.getElementById('apiStatus').classList.remove('hidden');
    }
    return false;
};

// Fetch Data
const fetchTasks = async () => {
    if (useLocalStorage) {
        tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    } else {
        const res = await fetch(`${API_URL}/tasks/`);
        tasks = await res.json();
    }
    renderTasks();
    updateStats();
};

const fetchCategories = async () => {
    if (useLocalStorage) {
        categories = JSON.parse(localStorage.getItem('categories') || '[{"id":1,"name":"Travail","color":"#3B82F6"},{"id":2,"name":"Perso","color":"#10B981"},{"id":3,"name":"Urgent","color":"#EF4444"}]');
    } else {
        const res = await fetch(`${API_URL}/categories/`);
        categories = await res.json();
        if (categories.length === 0) {
            // Create default categories
            await Promise.all([
                fetch(`${API_URL}/categories/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: 'Travail', color: '#3B82F6'})}),
                fetch(`${API_URL}/categories/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: 'Perso', color: '#10B981'})}),
                fetch(`${API_URL}/categories/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: 'Urgent', color: '#EF4444'})})
            ]);
            return fetchCategories();
        }
    }
    renderCategories();
};

// Render
const renderCategories = () => {
    const select = document.getElementById('taskCategory');
    select.innerHTML = '<option value="">Sans catégorie</option>';
    categories.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
};

const renderTasks = () => {
    const list = document.getElementById('tasksList');
    const empty = document.getElementById('emptyState');
    
    let filtered = tasks;
    if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);
    if (currentFilter === 'pending') filtered = tasks.filter(t => !t.completed);
    
    if (filtered.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    
    empty.classList.add('hidden');
    list.innerHTML = filtered.map(task => `
        <div class="task-item bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-5 transition-all ${task.completed ? 'task-completed' : ''}">
            <div class="flex items-start gap-4">
                <button onclick="toggleTask(${task.id})" class="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'} flex items-center justify-center hover:scale-110 transition-transform">
                    ${task.completed ? '<i class="fa-solid fa-check text-white text-xs"></i>' : ''}
                </button>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-2">
                        <h3 class="task-title font-semibold text-lg">${task.title}</h3>
                        ${task.category_name ? `<span class="px-2 py-1 text-xs rounded-full text-white" style="background-color: ${task.category_color}">${task.category_name}</span>` : ''}
                    </div>
                    ${task.description ? `<p class="text-gray-600 dark:text-gray-400 text-sm mb-2">${task.description}</p>` : ''}
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                        <i class="fa-regular fa-clock mr-1"></i>${new Date(task.created_at).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                    </p>
                </div>
                <button onclick="deleteTask(${task.id})" class="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
};

const updateStats = () => {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
};

// Actions
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        category: document.getElementById('taskCategory').value || null
    };
    
    if (useLocalStorage) {
        data.id = Date.now();
        data.created_at = new Date().toISOString();
        data.completed = false;
        const cat = categories.find(c => c.id == data.category);
        if (cat) {
            data.category_name = cat.name;
            data.category_color = cat.color;
        }
        tasks.unshift(data);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        await fetch(`${API_URL}/tasks/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        await fetchTasks();
    }
    
    e.target.reset();
    renderTasks();
    updateStats();
});

window.toggleTask = async (id) => {
    if (useLocalStorage) {
        const task = tasks.find(t => t.id === id);
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        await fetch(`${API_URL}/tasks/${id}/toggle/`, {method: 'PATCH'});
        await fetchTasks();
    }
    renderTasks();
    updateStats();
};

window.deleteTask = async (id) => {
    if (!confirm('Supprimer cette tâche ?')) return;
    
    if (useLocalStorage) {
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        await fetch(`${API_URL}/tasks/${id}/`, {method: 'DELETE'});
        await fetchTasks();
    }
    renderTasks();
    updateStats();
};

document.getElementById('clearCompleted').addEventListener('click', async () => {
    if (!confirm('Supprimer toutes les tâches terminées ?')) return;
    
    const completed = tasks.filter(t => t.completed);
    if (useLocalStorage) {
        tasks = tasks.filter(t => !t.completed);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        await Promise.all(completed.map(t => fetch(`${API_URL}/tasks/${t.id}/`, {method: 'DELETE'})));
        await fetchTasks();
    }
    renderTasks();
    updateStats();
});

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Init
initTheme();
(async () => {
    await checkAPI();
    await fetchCategories();
    await fetchTasks();
})();
