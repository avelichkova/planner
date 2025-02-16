const date = new Date();

const beforeList = document.getElementById("todo-list")

function fetchTasks(date, month, year) {
    fetch(`/schedule/todo?date=${date}&month=${month}&year=${year}`)
        .then(response => response.json())
        .then(tasks => {
            console.log(tasks);
            const contentList = document.createElement("ul");
            tasks.forEach(task => {
                if(!task.isFinished) {
                    const content = document.createElement("li");
                    content.textContent = task.taskContent;
                    contentList.appendChild(content);
                }
            });

            beforeList.after(contentList);
        });
}

fetchTasks(date.getDate(), date.getMonth() + 1, date.getFullYear())