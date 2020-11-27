const deskTaskInp = document.querySelector(".descriptionTask");
const addTaskBtn = document.querySelector(".addTask");
const toDoTaskDiv = document.querySelector(".toDoTaskWrapper");

let tasks;
(!localStorage.tasks) ? (tasks = []) : (tasks = JSON.parse(localStorage.getItem("tasks"))) //для того, чтобы добавить новую задачу в массив задач, не теряя при этом старые (актуально при перезагрузке страницы)

function Task(descriptionTask) { //с помощью f конструктора создаём однотипные объекты
    this.descriptionTask = descriptionTask;
    this.completed = false;
}

let updateLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks)); //добавляем в локСтор key и преобразованную из простого объекта JSON-форматированный объект(это value)
}

//преобразует каждый объект массива tasks в html-шаблон
let createTemplate = (task, index) => { //item = task
    //динамические скобки
    return `
    <div class="toDoItem ${task.completed ? "checked" : ""}">
        <div class="checkboxCompleteTask ${task.completed ? "checked" : ""}">
            <label class="checkbox-other">
                <input onclick="completeTask(${index})" class="customCheckbox" type="checkbox" ${task.completed ? "checked" : ""}>
            </label>
        </div>
        <div class="taskDescription">
            ${task.descriptionTask}
        </div>
        <button onclick="deleteTask(${index})" class="btnDelete">удалить</button>
    </div>`;
}

let toDoItemElements = []; //массив для уже созданных задач

let filterTasks = () => {
    const activeTasks = tasks.length && tasks.filter(item => item.completed == false);
    const completedTasks = tasks.length && tasks.filter(item => item.completed == true);
    tasks = [...activeTasks, ...completedTasks];
}

let fillHtmlList = () => {
    toDoTaskDiv.innerHTML = ""; //очищаем содержимое главного div каждой задачи
    if (tasks.length > 0) { //если массив задач не пустой
        filterTasks(); //преображаем массив tasks
        tasks.forEach((item, index) => { //пробегаемся по преображённому массиву tasks
            toDoTaskDiv.innerHTML += createTemplate(item, index); //на каждой итерации цикла добавляем в содержимое toDoItem шаблон с разными item и index
        });
        toDoItemElements = document.querySelectorAll('.toDoItem'); //для f completeTask добавляем в массив уже созданные toDoItem
    }
}
fillHtmlList(); //при инициализации страницы

let completeTask = index => {
    console.log(tasks[index]);
    tasks[index].completed = !tasks[index].completed; //меняем значение выбранного объекта массива tasks на противоположное
    if (tasks[index].completed) {
        toDoItemElements[index].classList.add("checked");
    } else {
        toDoItemElements[index].classList.remove("checked");
    }
    setTimeout(() => {
        updateLocalStorage();
        fillHtmlList();
    }, 700);
}

let deleteTask = index => {
    toDoItemElements[index].classList.add("delition"); //для анимации
    setTimeout(() => {
        tasks.splice(index, 1);
        updateLocalStorage();
        fillHtmlList();
    }, 1000);
}

addTaskBtn.addEventListener("click", () => {
    if (deskTaskInp.value.length >= 5 && deskTaskInp.value.length <= 35) { //Описание задачи от a и до b символов
        tasks.push(new Task(deskTaskInp.value)); //по клику создаем новый объект в массиве tasks, в который передаём то, что ввёл пользователь
        updateLocalStorage();
        fillHtmlList(); //заполняет div одинаковыми объектами из массива tasks или lS
        deskTaskInp.value = ""; //зачищаем инпут каждый раз
    }
});