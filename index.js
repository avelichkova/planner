const express = require('express');
const path = require('path');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const app = express();
    
// const { agendaSelectDate } = require('./static/calendar');
// const { data } = require('./data')

//test
const arr = ["hello", "hi", "how are you"];

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, '/pages'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.resolve('static')))
app.use(express.static('styles'))

// app.get('/:year/:month/:day', (req, res) => {
//     res.send(`${req.params.year}/${req.params.month}/${req.params.day}`);
// })

app.get('/home', (req, res) => {
    // const data =  JSON.parse(localStorage.getItem('agenda'));// /home/:user-id 
    res.render("index");
    // console.log(selectedDay);
    //console.log(JSON.parse(localStorage.getItem('agenda')));
}) 

app.get("/agenda", (req, res) => {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const filteredEvents = JSON.parse(localStorage.getItem('agenda')).filter(e => e.month === month && e.year === year);
    res.json(filteredEvents);
});

const scheduleRouter = require("./app/schedule");
app.use("/schedule", scheduleRouter);

app.listen(3030, () => {
    console.log('Server listening on port 3030');
})

// module.exports = {getItem: localStorage.getItem, setItem: localStorage.setItem} ;
