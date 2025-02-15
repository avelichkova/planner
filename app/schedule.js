const scheduleRouter = require('express').Router();
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

const { authenticate, authToken, redirectIfLoggedIn } = require('./auth')

let currentUser = {};

let data = getData("schedule");

scheduleRouter.get('/:year/:month/:day', authenticate, (req, res) => { 
    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);
;
    const agendaSelectDate = data.find(d => d.username === currentUser.username).agenda.filter(a => a.year === year && a.month === month && a.date === date);
    agendaSelectDate.sort((a, b) => {
        const [hourA, minuteA] = a.time.split(':').map(Number);
        const [hourB, minuteB] = b.time.split(':').map(Number);

        const totalMinutesA = hourA * 60 + minuteA;
        const totalMinutesB = hourB * 60 + minuteB;
    
        return totalMinutesA - totalMinutesB; 
    });

    const todoSelectDate = data.find(d => d.username === currentUser.username).todo.filter(a => a.year === year && a.month === month && a.date === date);;

    const actionAddEvent = `/schedule/agenda/${year}/${month}/${date}/add`;
    const actionEditEvent = `/schedule/agenda/${year}/${month}/${date}/edit`;
    const actionAddTask = `/schedule/todo/${year}/${month}/${date}/add`;
    const actionEditTask = `/schedule/todo/${year}/${month}/${date}/edit`;

    res.render('agenda', { agendaSelectDate, todoSelectDate, actionAddEvent, actionEditEvent, actionAddTask, actionEditTask });
})

//agenda

scheduleRouter.get('/agenda/:year/:month/:day/add', authenticate, (req, res) => { 
    const method = 'Add';

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const action = `/schedule/agenda/${year}/${month}/${date}/add`;
    res.render('upsertAgenda', { action, method });
})

scheduleRouter.post('/agenda/:year/:month/:day/add', authenticate, (req, res) => { 
    const time = req.body.time;
    const event = req.body.event;
    const type = req.body.type;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const uniqueId = new Date().getTime();
    const newEvent = {time: time, eventContent: event, type: type, index: uniqueId, 
        isChecked: false, year: year, month: month, date: date};
    data.find(d => d.username === currentUser.username).agenda.push(newEvent)
    saveData("schedule", data);
    res.redirect(`/schedule/${year}/${month}/${date}`);

})

scheduleRouter.get('/agenda/:year/:month/:day/edit/:id', authenticate, (req, res) => { 
    const event = data.find(d => d.username === currentUser.username).agenda.find(e => e.index === +req.params.id);

    const oldTime = event.time;
    const oldEvent = event.eventContent;
    const oldType = event.type;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const method = 'Edit';
    const action = `/schedule/agenda/${year}/${month}/${date}/edit/` + req.params.id;

    res.render('upsertAgenda', {action, oldTime, oldEvent, oldType, method})
})

scheduleRouter.post('/agenda/:year/:month/:day/edit/:id', authenticate, (req, res) => {
    const time = req.body.time;
    const event = req.body.event;
    const type = req.body.type;
    const {isChecked} = req.body;

    const id = +req.params.id;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const eventToEdit = data.find(d => d.username === currentUser.username).agenda.find(e => e.index === id);

    if(time && event || type) {
        eventToEdit.time = time;
        eventToEdit.eventContent = event;
        eventToEdit.type = type;
    } else {
        eventToEdit.isChecked = JSON.parse(isChecked);
    }

    saveData("schedule", data);

    res.redirect(`/schedule/${year}/${month}/${date}`);
})

scheduleRouter.delete('/agenda/delete/:id', authenticate, (req, res) => { 
    const eventToDelete = +req.params.id;
    const eventIndex = data.find(d => d.username === currentUser.username).agenda.findIndex(e => e.index === eventToDelete);
    data.find(d => d.username === currentUser.username).agenda.splice(eventIndex, 1);
    saveData("schedule", data);
    res.status(200).send();
})

scheduleRouter.get("/", authenticate, (req, res) => { 
    currentUser = getData("current-user");
    
    const userData = data.find(d => d.username === currentUser.username);
    const agendaData = userData.agenda;
    const todoData = userData.todo;

    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const filteredEvents = agendaData.filter(e => e.month === month && e.year === year);
    const filteredTodos = todoData.filter(t => t.month === month && t.year === year)

    res.json([...filteredEvents, ...filteredTodos]);
});

// todo

scheduleRouter.get('/todo/:year/:month/:date/add', authenticate, (req, res) => { 
    const method = 'Add';

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.date);

    const action = `/schedule/todo/${year}/${month}/${date}/add`;
    res.render('upsertTodo', { action, method });
})

scheduleRouter.post('/todo/:year/:month/:date/add', authenticate, (req, res) => {
    const task = req.body.task;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.date);

    const uniqueId = new Date().getTime();
    const newEvent = {taskContent: task, index: uniqueId, 
        isChecked: false, isFinished: false, year: year, month: month, date: date};
        data.find(d => d.username === currentUser.username).todo.push(newEvent);

    saveData("schedule", data);

    res.redirect(`/schedule/${year}/${month}/${date}`);

})

scheduleRouter.get('/todo/:year/:month/:day/edit/:id', authenticate, (req, res) => { 
    const task = data.find(d => d.username === currentUser.username).todo.find(e => e.index === +req.params.id);

    const oldTask = task.taskContent;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const method = 'Edit';
    const action = `/schedule/todo/${year}/${month}/${date}/edit/` + req.params.id;

    res.render('upsertTodo', {action, oldTask, method})
})

scheduleRouter.post('/todo/:year/:month/:day/edit/:id', authenticate, (req, res) => { 
    const task = req.body.task;
    
    console.log(req.body)

    const { isChecked = null, isFinished = null } = req.body;

    const id = +req.params.id;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const taskToEdit = data.find(d => d.username === currentUser.username).todo.find(e => e.index === id);

    if(task) {
        taskToEdit.taskContent = task;
    } else if(isChecked !== null){
        taskToEdit.isChecked = JSON.parse(isChecked);
    } else {
        taskToEdit.isFinished = JSON.parse(isFinished);
    }

    saveData("schedule", data);

    res.redirect(`/schedule/${year}/${month}/${date}`);
})

scheduleRouter.delete('/task/delete/:id', authenticate, (req, res) => { 
    console.log("delete in router");
    const taskToDelete = req.params.id;
    const taskIndex = data.find(d => d.username === currentUser.username).todo.findIndex(e => e.index === taskToDelete);
    data.find(d => d.username === currentUser.username).todo.splice(taskIndex, 1);
    saveData("schedule", data);
    res.status(200).send();
})

scheduleRouter.get('/todo', authenticate, (req, res) => {
    const date = +(req.query.date);
    const month = +(req.query.month);
    const year = +(req.query.year);
    const filteredEvents = data.find(d => d.username === currentUser.username).todo.filter(e => e.month === month && e.year === year && e.date === date);
    res.json(filteredEvents);
})

function getData(dataName) {
    const data = localStorage.getItem(dataName) || '[]';
     return JSON.parse(data);
 }

 function saveData(dataName, dataArray) {
     const dataJson = JSON.stringify(dataArray);
     localStorage.setItem(dataName, dataJson);
 }

module.exports = scheduleRouter;