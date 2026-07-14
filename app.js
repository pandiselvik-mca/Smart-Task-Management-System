
// =============================
// SMART TASK MANAGEMENT SYSTEM
// app.js (FULL CLEAN VERSION)
// =============================


// ---------- LOGIN CHECK ----------
if (localStorage.getItem("login") !== "true") {
    window.location.href = "index.html";
}


// ---------- ELEMENTS ----------
const taskForm = document.getElementById("taskForm");

const taskName = document.getElementById("taskName");
const description = document.getElementById("description");
const priority = document.getElementById("priority");
const status = document.getElementById("status");
const dueDate = document.getElementById("dueDate");

const taskTable = document.getElementById("taskTable");

const search = document.getElementById("search");
const filterPriority = document.getElementById("filterPriority");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const highPriority = document.getElementById("highPriority");
const summaryTotal = document.getElementById("summaryTotal");
const summaryCompleted = document.getElementById("summaryCompleted");
const summaryPending = document.getElementById("summaryPending");
const summaryHigh = document.getElementById("summaryHigh");

const themeBtn = document.getElementById("themeBtn");
const logoutBtn = document.getElementById("logoutBtn");


// ---------- VARIABLES ----------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editIndex = -1;
let chart; // global chart reference


// ---------- SAVE ----------
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ---------- CREATE TASK ----------
function createTask() {

    return {
        name: taskName.value,
        description: description.value,
        priority: priority.value,
        status: status.value,
        date: dueDate.value
    };

}


// ---------- RESET FORM ----------
function resetForm() {
    taskForm.reset();
    editIndex = -1;
}


// ---------- ADD / UPDATE TASK ----------
taskForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let task = createTask();

    if (editIndex === -1) {
        tasks.push(task);
    } else {
        tasks[editIndex] = task;
        editIndex = -1;
    }

    saveTasks();
    renderTasks();
    updateDashboard();
    resetForm();
    renderCalendar();

});


// ---------- RENDER TASKS ----------
function loadChart() {

    let completed = tasks.filter(t => t.status === "Completed").length;
    let pending = tasks.filter(t => t.status === "Pending").length;
    let total = completed + pending;

    let completedPercentage =
        total === 0 ? 0 : Math.round((completed / total) * 100);

    let ctx = document.getElementById("taskChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    // Plugin to show text in center
    const centerText = {
        id: "centerText",
        beforeDraw(chart) {

            const { width, height, ctx } = chart;

            ctx.restore();

            ctx.font = "bold 32px Poppins";
            ctx.fillStyle = "#4F46E5";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                completedPercentage + "%",
                width / 2,
                height / 2 - 10
            );

            ctx.font = "16px Poppins";
            ctx.fillStyle = "#666";

            ctx.fillText(
                "Completed",
                width / 2,
                height / 2 + 25
            );

            ctx.save();
        }
    };

    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: ["Completed", "Pending"],

            datasets: [{

                data: [completed, pending],

                backgroundColor: [
                    "#22C55E",
                    "#F59E0B"
                ],

                borderColor: "#ffffff",

                borderWidth: 3,

                hoverBorderWidth: 5,

                hoverBorderColor: "#ffffff",

                hoverOffset: 18,

                cutout: "72%"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                animateRotate: true,

                animateScale: true,

                duration: 1500

            },

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        usePointStyle: true,

                        pointStyle: "circle",

                        padding: 20,

                        font: {

                            size: 14,

                            weight: "bold"

                        }

                    }

                },

                tooltip: {

                    backgroundColor: "#222",

                    titleColor: "#fff",

                    bodyColor: "#fff",

                    cornerRadius: 8,

                    padding: 12

                }

            }

        },

        plugins: [centerText]

    });

}
let weeklyChart;

function loadWeeklyChart() {

    const ctx = document.getElementById("weeklyChart").getContext("2d");

    if (weeklyChart) {
        weeklyChart.destroy();
    }

    weeklyChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{

    label: "Tasks Completed",

   data: [1, 2, 3, 4, 5, 5, 6],

    borderColor: "#4F46E5",

    backgroundColor: "rgba(79, 70, 229, 0.15)",

    fill: true,

    tension: 0.4,

    pointBackgroundColor: "#4F46E5",

    pointBorderColor: "#ffffff",

    pointBorderWidth: 2,

    pointRadius: 5,

    pointHoverRadius: 7

}]
            
        },
       options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: "Tasks Completed This Week",
            color: "#374151",
            font: {
                size: 16,
                weight: "bold"
            }
        }
    },

    scales: {

        x: {
            grid: {
                display: false
            },
            ticks: {
                color: "#6B7280",
                font: {
                    size: 13
                }
            }
        },

        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1,
                color: "#6B7280"
            },
            grid: {
                color: "#E5E7EB"
            }
        }

    }

}
    });

}
function renderTasks(data = tasks) {

    taskTable.innerHTML = "";

    data.forEach((task, index) => {

        let badge = "";

        if (task.priority === "High") {
            badge = `<span class="badge bg-danger">High</span>`;
        } else if (task.priority === "Medium") {
            badge = `<span class="badge bg-warning text-dark">Medium</span>`;
        } else {
            badge = `<span class="badge bg-success">Low</span>`;
        }

        taskTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>

                <td>
                    <b>${task.name}</b><br>
                    <small>${task.description}</small>
                </td>

                <td>${badge}</td>

                <td>${task.status}</td>

                <td>${task.date}</td>

                <td>

                    <button class="btn btn-warning btn-sm" onclick="editTask(${index})">
                        ✏️
                    </button>

                    <button class="btn btn-success btn-sm" onclick="completeTask(${index})">
                        ✔️
                    </button>

                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">
                        🗑️
                    </button>

                </td>
            </tr>
        `;

    });

}


// ---------- EDIT TASK ----------
function editTask(index) {

    taskName.value = tasks[index].name;
    description.value = tasks[index].description;
    priority.value = tasks[index].priority;
    status.value = tasks[index].status;
    dueDate.value = tasks[index].date;

    editIndex = index;

    window.scrollTo({ top: 0, behavior: "smooth" });
    Swal.fire({
    title: "Updated!",
    text: "Task updated successfully.",
    icon: "success",
    timer: 2000,
    showConfirmButton: false
   
});

}


// ---------- DELETE TASK ----------
function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();
renderTasks();
updateDashboard();
loadChart();   // 👈 ADD THIS
Swal.fire({
    title: "Deleted!",
    text: "Task deleted successfully.",
    icon: "success",
    timer: 2000,
    showConfirmButton: false
  
});
}


// ---------- COMPLETE TASK ----------
function completeTask(index) {

    Swal.fire({
        title: "Mark as Completed?",
        text: "Do you want to mark this task as completed?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes"
    }).then((result) => {

        if (result.isConfirmed) {

            tasks[index].status = "Completed";

            saveTasks();
            renderTasks();
            updateDashboard();
            loadChart();
            resetForm();
            renderCalendar();

            Swal.fire({
                title: "Completed!",
                text: "Task marked as completed successfully.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

        }

    });

}


// ---------- SEARCH ----------
search.addEventListener("keyup", function () {

    let value = this.value.toLowerCase();

    let filtered = tasks.filter(t =>
        t.name.toLowerCase().includes(value) ||
        t.description.toLowerCase().includes(value)
    );

    renderTasks(filtered);

});


// ---------- FILTER ----------
filterPriority.addEventListener("change", function () {

    if (this.value === "All") {
        renderTasks();
        return;
    }

    let filtered = tasks.filter(t => t.priority === this.value);

    renderTasks(filtered);

});


// ---------- DASHBOARD STATS ----------
function updateDashboard() {

    let total = tasks.length;
    let completed = tasks.filter(t => t.status === "Completed").length;
    let pending = tasks.filter(t => t.status === "Pending").length;
    let high = tasks.filter(t => t.priority === "High").length;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    highPriority.textContent = high;

    // Dashboard Summary
    summaryTotal.textContent = total;
    summaryCompleted.textContent = completed;
    summaryPending.textContent = pending;
    summaryHigh.textContent = high;
}


// ---------- DARK MODE ----------
themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );

});


// ---------- LOAD THEME ----------
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}


// ---------- LOGOUT ----------
logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("login");

    window.location.href = "index.html";

});


// ---------- INITIAL LOAD ----------
renderTasks();
updateDashboard();
loadChart();
checkDueTasks();
loadWeeklyChart();


// ---------- DUE DATE NOTIFICATION ----------
function checkDueTasks() {

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dueTasks = tasks.filter(task => {

        if (task.status === "Completed") return false;

        let due = new Date(task.date);
        due.setHours(0, 0, 0, 0);

        return due.getTime() === tomorrow.getTime();

    });

    if (dueTasks.length > 0) {

        let taskNames = dueTasks.map(task => `• ${task.name}`).join("<br>");

        Swal.fire({
            icon: "warning",
            title: "Reminder!",
            html: `
                <b>The following task(s) are due tomorrow:</b><br><br>
                ${taskNames}
            `,
            confirmButtonText: "OK"
        });

    }

}
