const socket = io("http://localhost:3030/home");
            const beforeEvent = document.getElementById("next-event");

            socket.on('next-event', (event) => {
                const time = document.getElementById("time");
                time.textContent = event.time;
                
                const content = document.getElementById("content");
                content.textContent = event.eventContent;
            })