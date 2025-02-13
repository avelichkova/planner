// /agenda, /agenda/add, /agenda/edit/:id 

const agendaRouter = require('express').Router();
// const {getItem, setItem} = require("../index")
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
// const { data } = require('./data');
// const { saveAgenda } = require('./localHostManage');

// const localStorage = require("./schedule")

// const { getAgenda, saveAgenda } = require("./schedule");

let data = getAgenda();

agendaRouter.get('/:year/:month/:day/add', (req, res) => {
    const method = 'Add';

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const action = `/schedule/agenda/${year}/${month}/${date}/add`;
    res.render('upsert', { action, method });
})

agendaRouter.post('/:year/:month/:day/add', (req, res) => {
    const time = req.body.time;
    const event = req.body.event;
    const type = req.body.type;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const newEvent = {time: time, eventContent: event, type: type, index: data.length, 
        isChecked: false, year: year, month: month, date: date};
    data.push(newEvent);
        console.log(newEvent);
        // console.log(data);
    saveAgenda();
    // console.log(data)
    res.redirect(`/schedule/${year}/${month}/${date}`);

})

agendaRouter.get('/:year/:month/:day/edit/:id', (req, res) => {
    const event = data.find(e => e.index === +req.params.id);

    const oldTime = event.time;
    const oldEvent = event.eventContent;
    const oldType = event.type;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const method = 'Edit';
    const action = `/schedule/agenda/${year}/${month}/${date}/edit/` + req.params.id;

    res.render('upsert', {action, oldTime, oldEvent, oldType, method})
})

agendaRouter.post('/:year/:month/:day/edit/:id', (req, res) => {
    // console.log(req.body);
    const time = req.body.time;
    const event = req.body.event;
    const type = req.body.type;
    const {isChecked} = req.body;

    const id = +req.params.id;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const eventToEdit = data.find(e => e.index === id);

    if(time && event || type) {
        eventToEdit.time = time;
        eventToEdit.eventContent = event;
        eventToEdit.type = type;
    } else {
        eventToEdit.isChecked = JSON.parse(isChecked);
    }

    saveAgenda();

    res.redirect(`/schedule/${year}/${month}/${date}`);
})

agendaRouter.delete('/delete/:id', (req, res) => {
    console.log("delete in router");
    const eventToDelete = req.params.id - 1;
    data.splice(eventToDelete, 1);
    saveAgenda();
    res.status(200).send();
})

function getAgenda() {
   const agenda = localStorage.getItem('agenda') || '[]';
//    const agenda = getItem('agenda') || '[]';
    return JSON.parse(agenda);
}

function saveAgenda() {
    const agendaJson = JSON.stringify(data);
    localStorage.setItem('agenda', agendaJson);
    // setItem('agenda', agendaJson);
}

// module.exports = { 
//     router : agendaRouter, 
//     getAgenda : getAgenda 
// };

// module.exports = agendaRouter;
//module.exports = { getAgenda };