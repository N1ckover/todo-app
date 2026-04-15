const input = document.getElementById("taskInput");
const addButton = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");


const filterAll = document.getElementById("filterAll");
const filterCompleted = document.getElementById("filterCompleted");
const filterPending = document.getElementById("filterPending");

// AGREGAR TAREA
function addTask() {
    const taskText = input.value.trim();

    if (taskText === "") return;

    createTaskElement(taskText);

    input.value = "";

    saveTasks();
}

// CREAR ELEMENTO (esto es clave separar)
function createTaskElement(text) {
    const li = document.createElement("li");
    li.textContent = text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";

    deleteButton.addEventListener("click", function(event) {
        event.stopPropagation();
        li.remove();
        saveTasks();
    });

    li.addEventListener("click", function() {
        li.classList.toggle("completed");
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

    // reactivar eventos
    const items = document.querySelectorAll("li");

    items.forEach(function(li) {
        const deleteButton = li.querySelector("button");

        deleteButton.addEventListener("click", function(event) {
            event.stopPropagation();
            li.remove();
            saveTasks();
        });

        li.addEventListener("click", function() {
            li.classList.toggle("completed");
            saveTasks();
        });
    });
}

// eventos
addButton.addEventListener("click", addTask);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// cargar al iniciar
loadTasks();




filterAll.addEventListener("click", function() {
    const items = document.querySelectorAll("li");
    items.forEach(function(li) {
        li.style.display = "flex";
    });
});

