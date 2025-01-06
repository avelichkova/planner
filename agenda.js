// /agenda, /agenda/add, /agenda/edit/:id 

const agendaRouter = require('express').Router();
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
// const { data } = require('./data');
// const { saveAgenda } = require('./localHostManage');

let data = getAgenda();

agendaRouter.get('/', (req, res) => {
    data.sort((a, b) => {
        const [hourA, minuteA] = a.time.split(':').map(Number);
        const [hourB, minuteB] = b.time.split(':').map(Number);

        const totalMinutesA = hourA * 60 + minuteA;
        const totalMinutesB = hourB * 60 + minuteB;
    
        return totalMinutesA - totalMinutesB; 
    });
    res.render('agenda', { data });
})

agendaRouter.get('/add', (req, res) => {
    const method = 'Add';
    const action = '/agenda/add';
    res.render('upsert', { action, method });
})

agendaRouter.post('/add', (req, res) => {
    const time = req.body.time;
    const event = req.body.event;
    const type = req.body.type;

    const newEvent = {time: time, eventContent: event, type: type, index: data.length};
    data.push(newEvent);

    res.redirect('/agenda');
    saveAgenda();
})

agendaRouter.get('/edit/:id', (req, res) => {
    const oldTime = data[req.params.id - 1].time;
    const oldEvent = data[req.params.id - 1].eventContent;
    const oldType = data[req.params.id - 1].type;
    const method = 'Edit';
    const action = '/agenda/edit/' + req.params.id;

    res.render('upsert', {action, oldTime, oldEvent, oldType, method})
})

agendaRouter.post('/edit/:id', (req, res) => {
    const time = req.body.time;
    const event = req.body.event;
    const type = req.body.type;

    const eventToEdit = data[req.params.id - 1];

    eventToEdit.time = time;
    eventToEdit.eventContent = event;
    eventToEdit.type = type;
    saveAgenda();

    res.redirect('/agenda');
})

agendaRouter.delete('/delete/:id', (req, res) => {
    const eventToDelete = req.params.id - 1;
    data.splice(eventToDelete, 1);
    saveAgenda();
    res.status(200).send();
})

function getAgenda() {
    const agenda = localStorage.getItem('agenda') || '[]';
    return JSON.parse(agenda);
}

function saveAgenda() {
    const agendaJson = JSON.stringify(data);
    localStorage.setItem('agenda', agendaJson);
}

module.exports = agendaRouter;
// module.exports = { getAgenda }