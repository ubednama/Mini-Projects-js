// Todo App with Terminal Integration
class TodoApp {
    constructor() {
        this.terminal = null;
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.todoCount = document.getElementById('todoCount');

        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
        this.renderTodos();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('todo-app');
            this.terminal.log('Todo App v2.0 initialized...', 'system');
            this.terminal.log(`Loaded ${this.todos.length} tasks from storage`, 'info');
        }
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTodo());

        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTodos();
                if (this.terminal) this.terminal.log(`Filter set to: ${this.currentFilter}`, 'info');
            });
        });

        this.clearCompletedBtn.addEventListener('click', () => {
            const completedCount = this.todos.filter(t => t.completed).length;
            if (completedCount > 0) {
                this.todos = this.todos.filter(t => !t.completed);
                this.saveTodos();
                this.renderTodos();
                if (this.terminal) this.terminal.log(`Cleared ${completedCount} completed tasks`, 'warning');
            } else {
                if (this.terminal) this.terminal.log('No completed tasks to clear', 'info');
            }
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.todos.push(newTodo);
            this.saveTodos();
            this.renderTodos();
            this.todoInput.value = '';

            if (this.terminal) this.terminal.log(`Added task: "${text}"`, 'success');
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                const newStatus = !todo.completed;
                if (this.terminal) this.terminal.log(`Task "${todo.text}" marked as ${newStatus ? 'completed' : 'active'}`, 'info');
                return { ...todo, completed: newStatus };
            }
            return todo;
        });
        this.saveTodos();
        this.renderTodos();
    }

    deleteTodo(id) {
        const todoToDelete = this.todos.find(t => t.id === id);
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.renderTodos();

        if (this.terminal && todoToDelete) {
            this.terminal.log(`Deleted task: "${todoToDelete.text}"`, 'error');
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    renderTodos() {
        this.todoList.innerHTML = '';

        let filteredTodos = this.todos;
        if (this.currentFilter === 'active') {
            filteredTodos = this.todos.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filteredTodos = this.todos.filter(t => t.completed);
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">×</button>
            `;

            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTodo(todo.id);
            });

            this.todoList.appendChild(li);
        });

        const activeCount = this.todos.filter(t => !t.completed).length;
        this.todoCount.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
