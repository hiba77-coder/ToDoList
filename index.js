//TASKS 
const taskForm = document.getElementById("AddTask");
const newTask = document.getElementById("newTask");
const taskDate = document.getElementById("taskDate");
const tasksContainer = document.getElementById("tasks");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = {
    text: newTask.value,
    date: taskDate.value,
    done: false,
  };
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  newTask.value = "";
  taskDate.value = "";
});

function renderTasks() {
  tasksContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const item = document.createElement("div");
    item.className =
      "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
      <div>
        <input type="checkbox" class="form-check-input me-2" ${
          task.done ? "checked" : ""
        } onclick="toggleTask(${index})">
        <span style="text-decoration: ${task.done ? "line-through" : "none"}">
          ${task.text} ${task.date ? `<small>(${task.date})</small>` : ""}
        </span>
      </div>
      <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${index})">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    tasksContainer.appendChild(item);
  });
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

//POMODORO
const timerDisplay = document.getElementById("timer");
const sessionType = document.getElementById("sessionType");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const skipBtn = document.getElementById("skipBtn");
const workInput = document.getElementById("workTime");
const breakInput = document.getElementById("breakTime");
const autoStart = document.getElementById("autoStart");
const sessionCount = document.getElementById("sessionCount");

let workTime = parseInt(workInput.value) * 60;
let breakTime = parseInt(breakInput.value) * 60;
let time = workTime;
let isRunning = false;
let isWork = true;
let interval;
let completedSessions = 0;

function updateDisplay() {
  const m = Math.floor(time / 60);
  const s = time % 60;
  timerDisplay.textContent = `${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  sessionType.innerHTML = isWork
    ? '<i class="fa-solid fa-hourglass-half" style="color:#4CAF50;"></i> Work'
    : '<i class="fa-solid fa-mug-hot" style="color:#FFC107;"></i> Break';
  interval = setInterval(() => {
    time--;
    updateDisplay();
    if (time <= 0) {
      clearInterval(interval);
      isRunning = false;

      if (isWork) {
        completedSessions++;
        sessionCount.textContent = `Sessions completed: ${completedSessions}`;
        time = breakTime;
        isWork = false;
        sessionType.innerHTML =
          '<i class="fa-solid fa-mug-hot" style="color:#FFC107;"></i> Break';
      } else {
        time = workTime;
        isWork = true;
        sessionType.innerHTML =
          '<i class="fa-solid fa-hourglass-half" style="color:#4CAF50;"></i> Work';
      }

      updateDisplay();
      if (autoStart.checked) startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
  sessionType.innerHTML =
    '<i class="fa-solid fa-pause" style="color:#9E9E9E;"></i> Paused';
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  isWork = true;
  workTime = parseInt(workInput.value) * 60;
  breakTime = parseInt(breakInput.value) * 60;
  time = workTime;
  sessionType.innerHTML =
    '<i class="fa-solid fa-hourglass-half" style="color:#4CAF50;"></i> Work';
  updateDisplay();
}

function skipSession() {
  clearInterval(interval);
  isRunning = false;
  if (isWork) {
    time = breakTime;
    isWork = false;
    sessionType.innerHTML =
      '<i class="fa-solid fa-mug-hot" style="color:#FFC107;"></i> Break';
  } else {
    time = workTime;
    isWork = true;
    sessionType.innerHTML =
      '<i class="fa-solid fa-hourglass-half" style="color:#4CAF50;"></i> Work';
  }
  updateDisplay();
  if (autoStart.checked) startTimer();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
skipBtn.addEventListener("click", skipSession);

updateDisplay();
// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  themeToggle.classList.replace("btn-outline-dark", "btn-outline-light");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");

  if (isDark) {
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    themeToggle.classList.replace("btn-outline-dark", "btn-outline-light");
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeToggle.classList.replace("btn-outline-light", "btn-outline-dark");
    localStorage.setItem("theme", "light");
  }
});
