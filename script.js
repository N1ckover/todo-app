const input = document.getElementById("taskInput");
const addButton = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const filterAll = document.getElementById("filterAll");
const filterCompleted = document.getElementById("filterCompleted");
const filterPending = document.getElementById("filterPending");
const clearAll = document.getElementById("clearAll");

function removeTaskWithAnimation(li) {
    taskList.classList.remove("smoke-burst");
    void taskList.offsetWidth;
    taskList.classList.add("smoke-burst");

    li.classList.remove("fade-out");
    // Force reflow so the animation always restarts when class is applied.
    void li.offsetWidth;
    li.classList.add("fade-out");

    let removed = false;

    function finishRemove() {
        if (removed) return;
        removed = true;
        li.remove();
        saveTasks();
    }

    li.addEventListener("animationend", function(event) {
        if (event.animationName === "fadeOut") {
            finishRemove();
        }
    }, { once: true });

    taskList.addEventListener("animationend", function(event) {
        if (event.animationName === "sectionSmoke") {
            taskList.classList.remove("smoke-burst");
        }
    }, { once: true });

    setTimeout(finishRemove, 360);
}

// AGREGAR TAREA
function addTask() {
    const taskText = input.value.trim();
    if (taskText === "") return;

    createTaskElement(taskText);

    input.value = "";
    saveTasks();
}

// CREAR ELEMENTO
function createTaskElement(text) {
    const li = document.createElement("li");
    li.textContent = text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";

    deleteButton.addEventListener("click", function(event) {
        event.stopPropagation();
        removeTaskWithAnimation(li);
    });

    li.addEventListener("click", function() {
        li.classList.toggle("completed");

        if (li.classList.contains("completed")) {
            li.setAttribute("data-icon", "✅");
        } else {
            li.setAttribute("data-icon", "");
        }

        saveTasks();
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

// GUARDAR
function saveTasks() {
    localStorage.setItem("tasks", taskList.innerHTML);
}

// CARGAR
function loadTasks() {
    taskList.innerHTML = localStorage.getItem("tasks") || "";

    const items = document.querySelectorAll("li");

    items.forEach(function(li) {
        const deleteButton = li.querySelector("button");

        // reactivar eliminar con animación
        deleteButton.addEventListener("click", function(event) {
            event.stopPropagation();
            removeTaskWithAnimation(li);
        });

        // 🔥 reactivar completed (te faltaba esto)
        li.addEventListener("click", function() {
            li.classList.toggle("completed");

            if (li.classList.contains("completed")) {
                li.setAttribute("data-icon", "✅");
            } else {
                li.setAttribute("data-icon", "");
            }

            saveTasks();
        });
    });
}

// EVENTOS
addButton.addEventListener("click", addTask);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// FILTROS
filterAll.addEventListener("click", function() {
    setActiveButton(filterAll);

    const items = document.querySelectorAll("li");
    items.forEach(li => li.style.display = "flex");
});

filterCompleted.addEventListener("click", function() {
    setActiveButton(filterCompleted);

    const items = document.querySelectorAll("li");
    items.forEach(function(li) {
        li.style.display = li.classList.contains("completed") ? "flex" : "none";
    });
});

filterPending.addEventListener("click", function() {
    setActiveButton(filterPending);

    const items = document.querySelectorAll("li");
    items.forEach(function(li) {
        li.style.display = !li.classList.contains("completed") ? "flex" : "none";
    });
});

// BOTÓN ACTIVO
function setActiveButton(activeBtn) {
    const buttons = document.querySelectorAll(".filters button");

    buttons.forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
}

// ELIMINAR TODO
clearAll.addEventListener("click", function() {
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar TODAS las tareas?");

    if (confirmDelete) {
        taskList.innerHTML = "";
        saveTasks();
    }
});

// INICIO
loadTasks();