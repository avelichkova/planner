// const result = arr.filter(event => {
//     const [hour, min] = event.time.split(':').map(Number);
//     return 
// })
const today = new Date();
const beforeEvent = document.getElementById("next-event");

function getClosestFutureTime(timesArray) {
    
    const currentMinutes = today.getHours() * 60 + today.getMinutes(); // Convert current time to minutes

    // Convert time strings into minutes for easy comparison
    const futureTimes = timesArray
        .map(obj => {
            const [hour, minute] = obj.time.split(":").map(Number);
            const totalMinutes = hour * 60 + minute;
            return { ...obj, totalMinutes }; // Keep original object and add totalMinutes for sorting
        })
        .filter(obj => obj.totalMinutes > currentMinutes) // Only keep future times
        .sort((a, b) => a.totalMinutes - b.totalMinutes); // Sort in ascending order

    return futureTimes.length > 0 ? futureTimes[0] : null; // Return the closest future time or null
}

function fetchEvents(date, month, year) {
    fetch(`/schedule/agenda?&month=${month}&year=${year}`)
        .then(response => response.json())
        .then(events => {
            console.log(events);
            const todaysEvents = events.filter(e => e.date === date);
            const nextEvent = getClosestFutureTime(todaysEvents);
            const newDiv = document.createElement("div");
            const time = document.createElement("p");
            time.textContent = nextEvent.time;
            const content = document.createElement("p");
            content.textContent = nextEvent.eventContent;
            newDiv.appendChild(time).appendChild(content);
            beforeEvent.after(newDiv);
        });
}

// fetchEvents(today.getDate(), today.getMonth() + 1, today.getFullYear());
// console.log(getClosestFutureTime(arr));

const socket = io("localhost:3030/home");

socket.on('next-event', (event) => {
    const newDiv = document.createElement("div");
    const time = document.createElement("p");
    time.textContent = event.time;
    const content = document.createElement("p");
    content.textContent = event.eventContent;
    newDiv.appendChild(time).appendChild(content);
    beforeEvent.after(newDiv);
})