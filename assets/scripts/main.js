var input = document.querySelector(".todo_input");
let ul = document.querySelector(".todo_list");
let downArrowBtn = document.querySelector(".down_arrow");
var allBtn = document.querySelector(".all");
var activeBtn = document.querySelector(".active");
var completedBtn = document.querySelector(".completed");

// Initial state

var initialState = {
  allTodos: [],
  activeTab: "ALL_TODO",
};

// Reducers

function allTodoReducer(state = initialState.allTodos, action) {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: uuidv4(),
          text: action.payload,
          isDone: false,
        },
      ];

    case "TOGGLE_TODO":
      return state.reduce((acc, cv) => {
        if (cv.id === action.payload) {
          cv.isDone = !cv.isDone;
        }
        acc.push(cv);
        return acc;
      }, []);

    case "COMPLETE_ALL":
      var noOfCompletedTask = state.filter((task) => task.isDone).length;
      var length = state.length;

      if (noOfCompletedTask < length) {
        return state.map((task) => {
          if (!task.isDone) {
            task.isDone = true;
          }
          return task;
        });
      } else {
        return state.map((task) => {
          task.isDone = false;
          return task;
        });
      }

    case "DELETE_TODO":
      return state.filter((task) => task.id !== action.payload);

    case "UPDATE_TODO":
      var index = state.findIndex((task) => task.id === action.id);
      state[index].task = action.task;
      return state;

    case "CLEAR_COMPLETED":
      return state.filter((task) => !task.isDone);

    default:
      return state;
  }
}

function activeTabReducer(state = initialState.activeTab, action) {
  console.log(action.payload);
  switch (action.type) {
    case "CHANGE_TAB":
      return action.payload;

    default:
      return state;
  }
}

// Actions

var TodoInputAction = (payload) => {
  return {
    type: "ADD",
    payload,
  };
};

var ClearCompletedAction = (payload) => {
  return store.dispatch({
    type: payload,
  });
};

var ToggleTodoAction = (payload) => {
  return {
    type: "TOGGLE_TODO",
    payload,
  };
};

var DeleteTodoAction = (payload) => {
  return {
    type: "DELETE_TODO",
    payload,
  };
};

var CompleteAllAction = (payload) => {
  return {
    type: payload,
  };
};

// Change-Tab Actions

var AllTodoAction = (payload) => {
  return {
    type: "CHANGE_TAB",
    payload,
  };
};

var ActiveTodoAction = (payload) => {
  return {
    type: "CHANGE_TAB",
    payload,
  };
};

var CompletedTodoAction = (payload) => {
  return {
    type: "CHANGE_TAB",
    payload,
  };
};

var UpdateTodoAction = (text, id) => {
  return {
    type: "UPDATE_TODO",
    text,
    id,
  };
};

// Redux Store

var rootReducer = Redux.combineReducers({
  allTodos: allTodoReducer,
  activeTab: activeTabReducer,
});

let store = Redux.createStore(rootReducer);
store.subscribe(() => createUI(store.getState().allTodos));

// Filter Todo list on the basis of active tab

function getTodos(active, todos) {
  switch (active) {
    case "ALL_TODO":
      return todos;

    case "ALL_ACTIVE_TODO":
      return todos.filter((task) => !task.isDone);

    case "ALL_COMPLETED_TODO":
      return todos.filter((task) => task.isDone);
  }
}

function createUI(todos = []) {
  var ul = document.querySelector(".todo_list");
  ul.innerHTML = "";
  var activeTab = store.getState().activeTab;
  console.log(todos);
  var itemLeft = todos.filter((task) => !task.isDone).length;
  console.log(itemLeft, "left");

  // Filter Todos array before creating ui
  var todos = getTodos(activeTab, todos);

  var downArrow = document.querySelector(".down_arrow");
  var footer = document.querySelector(".footer");

  if (todos.length) {
    downArrow.style.visibility = "visible";
    footer.style.visibility = "visible";
  } else {
    if (activeTab == "ALL_TODO") {
      downArrow.style.visibility = "hidden";
      footer.style.visibility = "hidden";
    }
  }

  var noOfCompletedTask = todos.filter((task) => task.isDone).length;
  var clearCompletedBtn = document.querySelector(".clear_completed");

  if (noOfCompletedTask) {
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
    todoText.innerText = data.text;
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
      return store.dispatch(ClearCompletedAction("CLEAR_COMPLETED"));
    });
    todoText.addEventListener("dblclick", (event) => takeInput(event, data.id));
    li.addEventListener("mouseover", () => (delBtn.style.zIndex = 1));
    li.addEventListener("mouseout", () => (delBtn.style.zIndex = -1));

    delBtn.addEventListener("click", (event) => {
      deleteTodo(event, data.id);
    });

    checkTodo.addEventListener("click", (event) =>
      markCompleted(event, data.id)
    );

    ul.append(li);
  });
  document.querySelector(".item_left").innerHTML =
    itemLeft <= 1 ? `${itemLeft} item left` : `${itemLeft} items left`;
}

downArrowBtn.addEventListener("click", () => {
  return store.dispatch(CompleteAllAction("COMPLETE_ALL"));
});

// Footer Buttons

allBtn.addEventListener("click", (event) => {
  var prevSelectedBtn = document.querySelector(".selected");
  if (prevSelectedBtn) {
    prevSelectedBtn.classList.remove("selected");
  }
  event.target.classList.add("selected");

  store.dispatch(AllTodoAction("ALL_TODO"));
});

activeBtn.addEventListener("click", (event) => {
  var prevSelectedBtn = document.querySelector(".selected");
  if (prevSelectedBtn) {
    prevSelectedBtn.classList.remove("selected");
  }
  event.target.classList.add("selected");

  store.dispatch(AllTodoAction("ALL_ACTIVE_TODO"));
});

completedBtn.addEventListener("click", (event) => {
  var prevSelectedBtn = document.querySelector(".selected");
  if (prevSelectedBtn) {
    prevSelectedBtn.classList.remove("selected");
  }
  event.target.classList.add("selected");

  store.dispatch(CompletedTodoAction("ALL_COMPLETED_TODO"));
});

// Event handler functions

// Double Click handler(start)

function takeInput(event) {
  let id = event.target.parentNode.dataset.id;

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

  inputEdit.addEventListener("keyup", (event) => updateEditedValue(event, id));
}

function updateEditedValue(event, todoId) {
  if (event.keyCode === 13 && event.target.value.trim()) {
    var delBtn = document.querySelector(".delete");
    var tick = document.querySelector(".tick_wrapper");

    delBtn.style.visibility = "visible";
    tick.style.visibility = "visible";

    return store.dispatch(UpdateTodoAction(event.target.value, todoId));
  }
} // Double Click handler(end)

function todoInput(event) {
  if (event.keyCode === 13 && event.target.value.trim()) {
    var text = event.target.value;
    store.dispatch(TodoInputAction(text));
    event.target.value = "";
  }
}

function markCompleted(event, id) {
  return store.dispatch(ToggleTodoAction(id));
}

function deleteTodo(event, id) {
  return store.dispatch(DeleteTodoAction(id));
}

input.addEventListener("keyup", todoInput);
