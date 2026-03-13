let todos = [];
let currentFilter = 'all';

function initApp() {
  loadTodos();
  
  const todoInput = document.getElementById('todoInput');
  const addBtn = document.getElementById('addBtn');
  const todoList = document.getElementById('todoList');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clearCompleted');

  addBtn.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    render();
  });

  function addTodo() {
    const text = todoInput.value.trim();
    if (!text) {
      alert('할 일을 입력하세요');
      return;
    }

    if (todos.some(t => t.text === text)) {
      alert('이미 등록된 할 일입니다');
      return;
    }

    const todo = {
      id: Date.now(),
      text: text,
      completed: false
    };

    todos.push(todo);
    todoInput.value = '';
    saveTodos();
    render();
  }

  function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
      render();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
  }

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
      todos = JSON.parse(saved);
    }
  }

  function render() {
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });

    todoList.innerHTML = filteredTodos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todo.id})">
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
      </li>
    `).join('');

    const completedCount = todos.filter(t => t.completed).length;
    document.getElementById('todoCount').textContent = `전체 ${todos.length}개, 완료 ${completedCount}개`;
  }
}

document.addEventListener('DOMContentLoaded', initApp);