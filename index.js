const express = require('express');
const path = require('path');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

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

const eventNamespace = io.of('/home');

function getClosestFutureTime(timesArray) {
    let today = new Date();
    const currentMinutes = today.getHours() * 60 + today.getMinutes(); // Convert current time to minutes

    // Convert time strings into minutes for easy comparison
    const futureTimes = timesArray
    .map(obj => {
        const [hour, minute] = obj.time.split(":").map(Number);
        const totalMinutes = hour * 60 + minute;
        return { ...obj, totalMinutes }; // Keep original object and add totalMinutes for sorting
    })
    .filter(obj => obj.totalMinutes >= currentMinutes) // Only keep future times
    .sort((a, b) => a.totalMinutes - b.totalMinutes); // Sort in ascending order

    return futureTimes.length > 0 ? futureTimes[0] : {eventContent: "No more events for today!"}; // Return the closest future time or null
}

eventNamespace.on("connection", (socket) => {
    console.log("connected");
    const today = new Date();
    let todaysEvents = JSON.parse(localStorage.getItem("agenda")).filter(e => e.date === today.getDate());
    let nextEvent = getClosestFutureTime(todaysEvents);
    socket.emit('next-event', nextEvent);
    setInterval(() => {
        todaysEvents = JSON.parse(localStorage.getItem("agenda")).filter(e => e.date === today.getDate());
        nextEvent = getClosestFutureTime(todaysEvents);
        socket.emit('next-event', nextEvent)
    }, 1000);
    socket.emit("disconnect")
})

app.get('/home', (req, res) => {
    // const data =  JSON.parse(localStorage.getItem('agenda'));// /home/:user-id 
    res.render("index");
    // console.log(selectedDay);
    //console.log(JSON.parse(localStorage.getItem('agenda')));
}) 

// app.get("/agenda", (req, res) => {
//     const month = parseInt(req.query.month);
//     const year = parseInt(req.query.year);
//     const filteredEvents = JSON.parse(localStorage.getItem('agenda')).filter(e => e.month === month && e.year === year);
//     res.json(filteredEvents);
// });

const scheduleRouter = require("./app/schedule");
app.use("/schedule", scheduleRouter);





server.listen(3030, () => {
    console.log('Server listening on port 3030');
})

// module.exports = {getItem: localStorage.getItem, setItem: localStorage.setItem} ;
