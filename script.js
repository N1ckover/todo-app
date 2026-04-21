const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAll");
const filterButtons = document.querySelectorAll(".filters button[data-filter]");
const priorityContainer = document.querySelector(".priority-container");

const STORAGE_KEY = "todo_tasks_v1";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = "all";

const priorityMeta = {
  alta: { icon: "🔥" },
  media: { icon: "⚡" },
  baja: { icon: "🌱" }
};

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getFilteredTasks() {
  if (currentFilter === "completed") return tasks.filter(t => t.completed);
  if (currentFilter === "pending") return tasks.filter(t => !t.completed);
  return tasks;
}

function renderTasks() {
  taskList.innerHTML = "";

  const filtered = getFilteredTasks();

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.classList.add(`priority-${task.priority}`);
    li.dataset.id = String(task.id);
    li.dataset.icon = priorityMeta[task.priority]?.icon || "•";

    const left = document.createElement("div");
    left.className = "task-left";

    const priorityIcon = document.createElement("span");
    priorityIcon.className = "priority-icon";
    priorityIcon.textContent = priorityMeta[task.priority]?.icon || "•";

    const text = document.createElement("span");
    text.textContent = task.text;
    if (task.completed) text.classList.add("completed");

    const date = document.createElement("span");
    date.className = "task-date";
    date.textContent = formatDate(task.createdAt);

    left.appendChild(priorityIcon);
    left.appendChild(text);
    left.appendChild(date);

    const actions = document.createElement("div");

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.dataset.action = "toggle";
    toggleBtn.title = "Completar / desmarcar";
    toggleBtn.textContent = "✔";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.dataset.action = "delete";
    deleteBtn.title = "Eliminar";
    deleteBtn.textContent = "🗑";

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text,
    priority: prioritySelect.value,
    completed: false,
    createdAt: new Date().toISOString()
  });

  taskInput.value = "";
  taskInput.focus();

  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);
  const action = btn.dataset.action;
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (action === "toggle") {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    return;
  }

  if (action === "delete") {
    li.classList.add("fade-out");
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }, 320);
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

clearAllBtn.addEventListener("click", () => {
  if (tasks.length === 0) return;

  taskList.classList.add("smoke-burst");
  const items = [...taskList.querySelectorAll("li")];
  items.forEach(li => li.classList.add("fade-out"));

  setTimeout(() => {
    tasks = [];
    saveTasks();
    renderTasks();
    taskList.classList.remove("smoke-burst");
  }, 340);
});

syncPriorityVisual();
renderTasks();

function syncPriorityVisual() {
  if (!priorityContainer) return;
  priorityContainer.classList.remove("is-alta", "is-media", "is-baja");
  priorityContainer.classList.add(`is-${prioritySelect.value}`);
}

prioritySelect.addEventListener("change", syncPriorityVisual);