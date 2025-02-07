const express = require('express');
const path = require('path');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
// const { agendaSelectDate } = require('./static/calendar');
// const { data } = require('./data')

const app = express();

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

const agendaRouter = require("./app/agenda");
app.use("/agenda", agendaRouter);

app.listen(3030, () => {
    console.log('Server listening on port 3030');
})

// module.exports = {getItem: localStorage.getItem, setItem: localStorage.setItem} ;
