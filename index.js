const express = require('express');
const path = require('path');
// const { data } = require('./data')

const app = express();

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, '/pages'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.resolve('static')))
app.use(express.static('styles'))

app.get('/home', (req, res) => { // /home/:user-id 
    res.render("index");
})

const agendaRouter = require("./agenda");
app.use("/agenda", agendaRouter);

app.listen(3030, () => {
    console.log('Server listening on port 3030');
})