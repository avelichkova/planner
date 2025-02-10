const express = require('express');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

// app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve('tests')))

// const arr = ["hello", "hi", "how are you"];
// app.set("view engine", 'ejs');
// app.set('views', path.join(__dirname, '/pages'));

app.get('/', (req, res) => {
    
    res.sendFile(__dirname + '/index.html');
})

io.on("connection", (socket) => {
    socket.emit("info-arr", localStorage.getItem('agenda'));
})
server.listen(4040);

// document.addEventListener("DOMContentLoaded", () => {
//     fetch("/messages")
//         .then(response => response.json())
//         .then(messages => {
//             const container = document.getElementById("message-container");
//             container.innerHTML = messages.map(msg => `<p>${msg}</p>`).join("");

//             // Notify the server to modify index.html
//             fetch("/modify", { method: "POST" });
//         })
//         .catch(error => console.error("Error fetching messages:", error));
// });
