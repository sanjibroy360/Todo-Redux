var input = document.querySelector(".todo_input");
let ul = document.querySelector(".todo_list");
let downArrowBtn = document.querySelector(".down_arrow");
var todos = [];

var allBtn = document.querySelector(".all");
var activeBtn = document.querySelector(".active");
var completedBtn = document.querySelector(".completed");

function todoReducer(todos = [], action) {
  //   action.type = action.type.toUpperCase();

  switch (action.type) {
    case "ADD":
      return [
        ...todos,
        {
          id: uuidv4(),
          task: action.task,
          isDone: false,
        },
      ];
    case "COMPLETED":
      return (arr = todos.reduce((acc, cv) => {
        if (cv.id === action.id) {
          cv.isDone = !cv.isDone;
        }
        acc.push(cv);
        return acc;
      }, []));

    case "COMPLETE_ALL":
      var noOfCompletedTask = todos.filter((task) => task.isDone).length;
      var length = todos.length;

      if (noOfCompletedTask < length) {
        console.log("<length");

        return todos.reduce((acc, task) => {
          if (!task.isDone) {
            task.isDone = true;
          }

          acc.push(task);
          return acc;
        }, []);
      } else {
        console.log("===");
        return todos.map((task) => {
          task.isDone = false;
          return task;
        });
      }

    case "DELETE":
      return todos.filter((task) => task.id !== action.id);

    case "ALL_COMPLETED_TASK":
      return todos.filter((task) => task.isDone);

    case "ALL_ACTIVE_TASK":
      return todos.filter((task) => !task.isDone);

    case "ALL_TASK":
      return todos;

    case "UPDATE_TASK":
      var index = todos.findIndex((task) => task.id === action.id);
      todos[index].task = action.task;
      return todos;

    case "CLEAR_COMPLETED": 
      todos = todos.filter(task => !task.isDone);
      return todos;
  }
}

function takeInput(event) {
  let id = event.target.parentNode.dataset.id;
  console.log({ id });
  let p = event.target;
  let parent = event.target.parentNode;
  let inputEdit = document.createElement("input");

  var delBtn = document.querySelector(".delete");
  var tick = document.querySelector(".tick_wrapper");

  delBtn.style.visibility = "hidden";
  tick.style.visibility = "hidden";

  inputEdit.classList.add("todo_input");
  inputEdit.classList.add("edit");
  parent.replaceChild(inputEdit, p);
  inputEdit.innerText = event.target.innerText;

  inputEdit.value = event.target.innerText;

  inputEdit.addEventListener("keyup", (event) => editedValue(event, id));
}

function editedValue(event, todoId) {
  console.log({ todoId });

  if (event.keyCode === 13 && event.target.value.trim()) {
    var delBtn = document.querySelector(".delete");
    var tick = document.querySelector(".tick_wrapper");

    delBtn.style.visibility = "visible";
    tick.style.visibility = "visible";

    return store.dispatch({
      type: "UPDATE_TASK",
      task: event.target.value,
      id: todoId,
    });
  }
}

function markCompleted(event, id) {
  return store.dispatch({
    type: "COMPLETED",
    id,
  });
}

function deleteTask(event, id) {
  return store.dispatch({
    type: "DELETE",
    id,
  });
}

function createUI(todos = []) {
  var ul = document.querySelector(".todo_list");
  ul.innerHTML = "";
  var todos = store.getState() || [];
  console.log(todos);
  var downArrow = document.querySelector(".down_arrow");
  var footer = document.querySelector(".footer");
  if (todos.length) {
    downArrow.style.visibility = "visible";
    footer.style.visibility = "visible";
  }
  var noOfCompletedTask = todos.filter((task) => task.isDone).length;
  var clearCompletedBtn = document.querySelector(".clear_completed");
  if(noOfCompletedTask) {
      clearCompletedBtn.style.visibility = "visible";
  } else {
    clearCompletedBtn.style.visibility = "hidden";
  }

  
  todos.forEach((data) => {
    let li = document.createElement("li");
    li.classList.add("flex");
    li.classList.add("list_item");
    li.setAttribute("data-id", data.id);

    let checkTodo = document.createElement("input");
    checkTodo.type = "checkbox";
    checkTodo.checked = data.isDone;

    checkboxId = `toggle${data.id}`;
    checkTodo.setAttribute("id", checkboxId);
    checkTodo.classList.add("check");
    checkTodo.style.display = "none";

    let label = document.createElement("label");
    label.setAttribute("for", checkboxId);
    let tickWrapper = document.createElement("div");
    tickWrapper.classList.add("tick_wrapper");

    let tickImage = document.createElement("img");
    tickImage.src = "";
    tickImage.classList.add("tick_mark");
    tickWrapper.appendChild(tickImage);
    label.appendChild(tickWrapper);

    let todoText = document.createElement("p");
    todoText.innerText = data.task;
    todoText.classList.add("todo_show");

    let delBtn = document.createElement("span");
    delBtn.innerHTML = "&#10005;";
    delBtn.classList.add("delete");

    if (data.isDone) {
      tickImage.src = "./assets/media/tick.png";
      todoText.classList.add("strike");
    } else {
      if (todoText.classList.contains("strike")) {
        tickImage.src = "";
        todoText.classList.remove("strike");
      }
    }

    li.append(checkTodo, label, todoText, delBtn);

    // Event Listeners
    clearCompletedBtn.addEventListener("click", () => {
        return store.dispatch({
            type: "CLEAR_COMPLETED"
        })
    })
    todoText.addEventListener("dblclick", (event) => takeInput(event, data.id));
    li.addEventListener("mouseover", () => (delBtn.style.zIndex = 1));
    li.addEventListener("mouseout", () => (delBtn.style.zIndex = -1));

    delBtn.addEventListener("click", (event) => {
      deleteTask(event, data.id);
    });

    checkTodo.addEventListener("click", (event) =>
      markCompleted(event, data.id)
    );

    var itemLeft = todos.filter((task) => !task.isDone).length;

    document.querySelector(".item_left").innerHTML =
      itemLeft <= 1 ? `${itemLeft} item left` : `${itemLeft} items left`;
    ul.append(li);
  });
}

let store = Redux.createStore(todoReducer);
store.subscribe(createUI);

todos = store.getState() || [];

createUI(todos);

downArrowBtn.addEventListener("click", () => {
  console.log("down arrow");
  return store.dispatch({
    type: "COMPLETE_ALL",
  });
});

allBtn.addEventListener("click", (event) => {
  var prevSelectedBtn = document.querySelector(".selected");
  if (prevSelectedBtn) {
    prevSelectedBtn.classList.remove("selected");
  }

  event.target.classList.add("selected");
});

activeBtn.addEventListener("click", (event) => {
  var prevSelectedBtn = document.querySelector(".selected");
  if (prevSelectedBtn) {
    prevSelectedBtn.classList.remove("selected");
  }

  event.target.classList.add("selected");
});

completedBtn.addEventListener("click", (event) => {
  var prevSelectedBtn = document.querySelector(".selected");
  if (prevSelectedBtn) {
    prevSelectedBtn.classList.remove("selected");
  }

  event.target.classList.add("selected");
});

function todoInput(event) {
  if (event.keyCode === 13 && event.target.value.trim()) {
    var task = event.target.value;
    store.dispatch({ type: "ADD", task });
    event.target.value = "";
  }
}

input.addEventListener("keyup", todoInput);
