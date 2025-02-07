// /agenda, /agenda/add, /agenda/edit/:id 

const agendaRouter = require('express').Router();
const {getItem, setItem} = require("../index")
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
// const { data } = require('./data');
// const { saveAgenda } = require('./localHostManage');

let data = getAgenda();

agendaRouter.get('/:year/:month/:day', (req, res) => {
    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);
    const fullDate = {year: year, month: month, date: date};

    const agendaSelectDate = data.filter(a => a.year === year && a.month === month && a.date === date);
    agendaSelectDate.sort((a, b) => {
        const [hourA, minuteA] = a.time.split(':').map(Number);
        const [hourB, minuteB] = b.time.split(':').map(Number);

        const totalMinutesA = hourA * 60 + minuteA;
        const totalMinutesB = hourB * 60 + minuteB;
    
        return totalMinutesA - totalMinutesB; 
    });
    // console.log(agendaSelectDate);
    const action = `/agenda/${year}/${month}/${date}/add`;
    const actionAdd = `/agenda/${year}/${month}/${date}/add`;
    const actionEdit = `/agenda/${year}/${month}/${date}/edit`;
    res.render('agenda', { agendaSelectDate, actionAdd, actionEdit });
    // module.exports = { fullDate };
})

agendaRouter.get('/:year/:month/:day/add', (req, res) => {
    const method = 'Add';

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const action = `/agenda/${year}/${month}/${date}/add`;
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

    res.redirect(`/agenda/${year}/${month}/${date}`);
    saveAgenda();
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
    const action = `/agenda/${year}/${month}/${date}/edit/` + req.params.id;

    res.render('upsert', {action, oldTime, oldEvent, oldType, method})
})

agendaRouter.post('/:year/:month/:day/edit/:id', (req, res) => {
    const time = req.body.time;
    const event = req.body.event;
    const type = req.body.type;

    const id = +req.params.id;

    const year = (+req.params.year);
    const month = (+req.params.month);
    const date = (+req.params.day);

    const eventToEdit = data.find(e => e.index === id);

    eventToEdit.time = time;
    eventToEdit.eventContent = event;
    eventToEdit.type = type;
    saveAgenda();

    res.redirect(`/agenda/${year}/${month}/${date}`);
})

agendaRouter.delete('/delete/:id', (req, res) => {
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

module.exports = agendaRouter;
//module.exports = { getAgenda };