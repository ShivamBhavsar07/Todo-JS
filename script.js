const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("alert");
const listItems = document.getElementById("list-items");
const addTaskButton = document.getElementById("addTaskButton");
const progressBar = document.getElementById("progressBar");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
    todoAlert.innerText = message;
    setTimeout(() => {
        todoAlert.innerText = "";
    }, 2000);
}

function renderTodoList() {
    listItems.innerHTML = "";
    todo.forEach((item, index) => {
        let li = document.createElement("li");
        li.classList.toggle("completed", item.completed);

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;
        checkbox.onchange = () => {
            item.completed = !item.completed;
            updateProgress();
            setLocalStorage();
            renderTodoList();
        };

        let span = document.createElement("span");
        span.innerText = item.text;

        let editButton = document.createElement("button");
        editButton.className = "edit";
        editButton.innerText = "Edit";
        editButton.onclick = () => editTask(index);

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => deleteTask(index);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        listItems.appendChild(li);
    });
}

function updateProgress() {
    const totalTasks = todo.length;
    const completedTasks = todo.filter(item => item.completed).length;
    const progressPercentage = (totalTasks === 0) ? 0 : (completedTasks / totalTasks) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function addTask() {
    if (todoValue.value === "") {
        setAlertMessage("Please enter your todo text!");
        return;
    }
    let isPresent = todo.some(element => element.text === todoValue.value);
    if (isPresent) {
        setAlertMessage("This todo item already exists!");
        return;
    }

    let newItem = {
        text: todoValue.value,
        completed: false
    };

    todo.push(newItem);
    setLocalStorage();
    todoValue.value = "";
    setAlertMessage("Todo item added successfully!");
    renderTodoList();
    updateProgress();
}

function editTask(index) {
    let newTask = prompt("Edit your task:", todo[index].text);
    if (newTask !== null) {
        todo[index].text = newTask;
        setLocalStorage();
        renderTodoList();
        setAlertMessage("Todo item edited successfully!");
    }
}

function deleteTask(index) {
    todo.splice(index, 1);
    setLocalStorage();
    renderTodoList();
    updateProgress();
    setAlertMessage("Todo item deleted successfully!");
}

addTaskButton.addEventListener("click", addTask);
document.addEventListener("DOMContentLoaded", () => {
    renderTodoList();
    updateProgress();
});
