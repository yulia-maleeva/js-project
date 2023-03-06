/*
TODO list
Requirements
all , completed , in progress ( with possibility to filter )
after reload page list items should not disappear
search through all items should be implemented
possibility to edit , complete, delete item from todo list
*/

const nameForm = document.getElementById("name-form");
const todoListForm = document.getElementById("todo-list-form");
const userName = document.querySelector('#name-form input[name="name"]');
const greetingField = todoListForm.querySelector(".greeting");
const newItemButton = todoListForm.querySelector(".new-item-button");
const newItemInput = todoListForm.querySelector(".new-item-input");

let tasks = [];

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!userName.value) {
    return;
  }
  setUserName(userName.value);
  nameForm.classList.remove("active");
  activateTodoListForm();
});

function showMainBlock() {
  if (!getUserName()) {
    nameForm.classList.add("active");
  } else {
    activateTodoListForm();
  }
}

function setUserName(name) {
  const userNameValue = localStorage.setItem("userName", name);
  return userNameValue;
}

function getUserName() {
  return localStorage.getItem("userName");
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  let json = localStorage.getItem("tasks");

  if (json) {
    tasks = JSON.parse(json);
  }
}

function showTasks() {
  const itemsBlock = document.querySelector(".items");
  let element = "";
  itemsBlock.innerHTML = "";

  tasks.forEach((task, index) => {
    element += `<li ${task.status ? 'class="done"' : ""}>
        <input ${
          task.status ? "checked" : ""
        } data-key="${index}" type="checkbox"/>
        <span class="task-name">${task.name}</span>
        <div class="name-editor">
            <input value="${task.name}" class="name-input" type="text" />
            <button data-key="${index}" class="confirm-new-name"><i class="fa-solid fa-check"></i></button>
        </div>
        <div class="actions">
            <button type="button" class="edit-button"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" data-key="${index}" class="remove-button"><i class="fa-solid fa-trash"></i></button>
        </div>
    </li>`;
  });

  itemsBlock.innerHTML += element;

  let checkInputs = document.querySelectorAll('input[type="checkbox"]');

  checkInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      let target = e.target;
      const index = target.dataset["key"];
      tasks[index].status = target.checked;
      saveTasks();
      showTasks();
    });
  });

  const removeButtons = document.querySelectorAll(".remove-button");
  const editButtons = document.querySelectorAll(".edit-button");

  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let li = button.parentNode.parentNode;
      li.classList.add("editing");
    });
  });

  document.querySelectorAll(".confirm-new-name").forEach((button) => {
    button.addEventListener("click", (e) => {
      let input = e.target.parentNode.querySelector("input");
      if (input.value) {
        const index = e.target.dataset["key"];
        tasks[index].name = input.value;

        saveTasks();
        showTasks();
      }
    });
  });

  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset["key"];

      tasks.splice(index, 1);

      saveTasks();
      showTasks();
    });
  });
}

function activateTodoListForm() {
  todoListForm.classList.add("active");
  const userName = getUserName();
  const greeting = `You are welcome, ${userName}`;

  greetingField.innerHTML += greeting;

  getTasks();
  showTasks();

  newItemButton.addEventListener("click", () => {
    newItemButton.classList.add("hidden");
    newItemInput.classList.add("active");
  });

  newItemInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      if (
        !e.target.value ||
        tasks.filter((task) => task.name === e.target.value).length
      ) {
        return;
      }

      const item = {
        name: e.target.value,
        status: false,
      };

      tasks.push(item);
      newItemButton.classList.remove("hidden");
      newItemInput.classList.remove("active");
      e.target.value = "";
      showTasks();
      saveTasks();
    }
  });
}

showMainBlock();
