let input = document.getElementById("to-do input");
let addBtn = document.getElementById("addButton");
let todolist = document.getElementById("todolist");

addBtn.addEventListener('click', function(){
    let TaskText = input.value.trim();
    if(TaskText === "") {
        alert("Please Enter a Task");
    } else {

        let emptyState = document.querySelector(".empty-state");
        if (emptyState) {
            emptyState.remove();
        }


        let itemDiv = document.createElement("div");
        itemDiv.classList.add("todo-item");

        itemDiv.innerHTML = `
            <input type="checkbox" class="todo-checkbox"/>  
            <div class="task-text">${TaskText}</div>
            <button class="delete">Delete</button>
            <button class="edit">Edit</button>
        `;

        todolist.appendChild(itemDiv); 
        updateStats();
        saveTasks(); 
        input.value = "";

        count++;
    }
});

todolist.addEventListener('change', function (event) {
    if (event.target.classList.contains("todo-checkbox")) {
        const taskItem = event.target.closest(".todo-item");
        if (event.target.checked) {
            taskItem.classList.add("completed");  
        } else {
            taskItem.classList.remove("completed");
        }
        updateStats();
        saveTasks(); 
    }
})


todolist.addEventListener('click', function (event) {
    const item = event.target.closest('.todo-item');

    //edit
    if(event.target.classList.contains('edit')) {
        const taskTextDiv = item.querySelector('.task-text');
        const oldText = taskTextDiv.textContent;

        const newText = prompt("Edit your task:", oldText);
        if (newText !== null && newText.trim() !== "") {
            taskTextDiv.textContent = newText.trim();
            saveTasks();
        }
    }

    //delete
    if (event.target.classList.contains('delete')) {
        item.remove();
        updateStats();
        saveTasks();
    
        // if list is now empty
        if (document.querySelectorAll(".todo-item").length === 0) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("empty-state");
            emptyDiv.innerHTML = "<b>All tasks cleared. Want to add something new?✨📝</b>";
            todolist.appendChild(emptyDiv);
        }
    }
});


function updateStats() {
    let all = document.querySelectorAll(".todo-item");
    let completed = document.querySelectorAll(".todo-item.completed");

    let total = all.length;
    let done = completed.length;
    let pending = total - done;
    let rate = total > 0 ? ((done / total) * 100).toFixed(0) + "%" : "0%";

    document.getElementById("total-tasks").innerText = total;
    document.getElementById("pending-tasks").innerText = pending;
    document.getElementById("completed-tasks").innerText = done;
    document.getElementById("completion-rate").innerText = rate;
}

function saveTasks() {
    const allTasks = [];
    document.querySelectorAll(".todo-item").forEach(item => {
        const text = item.querySelector(".task-text")?.innerText || "";
        const priority = item.querySelector("div:nth-child(3)")?.innerText || "low";
        const completed = item.classList.contains("completed");
        allTasks.push({ text, priority, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    // Remove empty-state if tasks exist
    if (storedTasks.length > 0) {
        const emptyState = document.querySelector(".empty-state");
        if (emptyState) emptyState.remove();
    }

    storedTasks.forEach(task => {
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("todo-item");
        if (task.completed) {
            itemDiv.classList.add("completed");
        }

        itemDiv.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${task.completed ? "checked" : ""}/>  
            <div class="task-text">${task.text}</div>
            <button class="delete">Delete</button>
            <button class="edit">Edit</button>
        `;

        const checkbox = itemDiv.querySelector(".todo-checkbox");
        if (task.completed) checkbox.classList.add("completed");

        todolist.appendChild(itemDiv);
    });

    updateStats(); 
}


function filterTasks(filter) {
    const tasks = document.querySelectorAll(".todo-item"); 
  
    tasks.forEach(task => {
      const isCompleted = task.classList.contains("completed"); 

      if (filter === "all") {
        task.style.display = "flex"; // show all tasks
      } else if (filter === "completed" && isCompleted) {
        task.style.display = "flex"; // show only completed tasks
      } else if (filter === "pending" && !isCompleted) {
        task.style.display = "flex"; // show only pending tasks
      } else {
        task.style.display = "none"; // hide the rest
      }
    });
  }

todolist.addEventListener('change', function (event) {
    if (event.target.classList.contains("todo-checkbox")) {
        const taskItem = event.target.closest(".todo-item");

        if (event.target.checked) {
            taskItem.classList.add("completed"); 
        } else {
            taskItem.classList.remove("completed");
        }

        updateStats();
    }
});

loadTasks(); 


