const express = require('express');
const path = require('path');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()

// const { agendaSelectDate } = require('./static/calendar');
// const { data } = require('./data')

//test
// const arr = ["hello", "hi", "how are you"];

const { authenticate, authToken, redirectIfLoggedIn } = require('./auth')

const usersData = getData('users');
const scheduleData = getData('schedule');
let currentUser = {}

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, '../pages'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.resolve('static')))
app.use(express.static('styles'))
app.use(cookieParser())

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
    // console.log("username" + currentUser.username)
    let getInfo = JSON.stringify(getData("schedule").find(d => d.username === currentUser.username));
    // console.log(JSON.parse(jjj).agenda);
    let todaysEvents = JSON.parse(getInfo).agenda.filter(e => e.date === today.getDate());
    let nextEvent = getClosestFutureTime(todaysEvents);
    socket.emit('next-event', nextEvent);
    setInterval(() => {
        getInfo = JSON.stringify(getData("schedule").find(d => d.username === currentUser.username));
        todaysEvents = JSON.parse(getInfo).agenda.filter(e => e.date === today.getDate());
        nextEvent = getClosestFutureTime(todaysEvents);
        socket.emit('next-event', nextEvent)
    }, 1000);
    // socket.emit("disconnect")
})

// app.get('/protected', authToken, (req, res) => {
//     // console.log(req.decoded.email);
//     const user = scheduleData.find(i => i.username == req.decoded.username)
//     console.log(user);
//     const info = user.username;
//     res.render('testLogin', { info });
// })

app.get('/', redirectIfLoggedIn, (req, res) => {
    res.render('login')
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
}

app.post('/', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(password);
    const user = usersData.find(u => u.email === email);
    if(!user) res.send(400).send("No such user")
    // console.log(user.password)
    try {
        if(await bcrypt.compare(password, user.password)){
            const userToken = { username: user.username }
            const accessToken = generateAccessToken(userToken)
            console.log(accessToken);
            res.cookie('accessToken', accessToken, {
                httpOnly: true
            })
            res.redirect('/home');
        } else {
            res.status(401).send('Wrong password')
        }
    } catch {
        res.status(500).send();
    }
})

app.get('/register', redirectIfLoggedIn, (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.genSalt()
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            const user = {username: username, email : email, password : hashedPassword}
            const userSchedule = {username: username, todo: [], agenda: []};
            usersData.push(user);
            saveData("users", usersData)
            scheduleData.push(userSchedule);
            saveData("schedule", scheduleData);
            res.status(201).redirect('/');
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

function getData(dataName) {
    const data = localStorage.getItem(dataName) || '[]';
     return JSON.parse(data);
 }

 function saveData(dataName, dataArray) {
     const dataJson = JSON.stringify(dataArray);
     localStorage.setItem(dataName, dataJson);
 }





// let userdata = [];

app.get('/home', authToken, (req, res) => {
    const user = scheduleData.find(i => i.username == req.decoded.username)
    currentUser = user;
    // userdata = user;
    saveData("current-user", user);
    // // console.log(user);
    // // const info = user.username;
    // res.render('index', { user });
    res.render("index");
}) 

const scheduleRouter = require("./schedule");
app.use("/schedule", scheduleRouter);

server.listen(3030, () => {
    console.log('Server listening on port 3030');
})



  module.exports = { authenticate }


// module.exports = {getItem: localStorage.getItem, setItem: localStorage.setItem} ;
