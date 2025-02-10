const socket = io("localhost:4040");
// Function to create and add a div with text
function addDivWithText(text) {
    // Create a new div element
    const newDiv = document.createElement("div");

    // Set text content
    newDiv.textContent = text;

    // Optional: Add some styles
    newDiv.style.padding = "10px";
    newDiv.style.margin = "10px";
    newDiv.style.backgroundColor = "#f0f0f0";
    newDiv.style.border = "1px solid #ccc";

    // Append the div to the body (or any other container)
    document.body.appendChild(newDiv);
}

socket.on("info-arr", (arr) => {
    // const list = document.getElementById("info");
    // list.innerHTML = arr.map(msg => `<li>${msg}</li>`).join("");
    console.log(arr);
})

// Example usage
addDivWithText("Hello, this is a dynamically added div!");

// const express = require("express");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 4040;

// // Middleware to serve static files (e.g., CSS, JS)
// app.use(express.static("public"));

// // API to send JSON data
// app.get("/messages", (req, res) => {
//     res.json(["Hello", "Welcome!", "Goodbye"]);
// });

// // Serve the initial index.html
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "index.html"));
// });

// // Route to modify and serve updated index.html
// app.get("/users", (req, res) => {
//     fs.readFile(path.join(__dirname, "index.html"), "utf8", (err, data) => {
//         if (err) {
//             res.status(500).send("Error reading file");
//             return;
//         }

//         // Inject new content into index.html
//         const newContent = data.replace(
//             "<!-- PLACEHOLDER -->",
//             `<p>Modified with server data!</p>`
//         );

//         // Save modified file (or you can just send it)
//         fs.writeFile(path.join(__dirname, "modified_index.html"), newContent, (err) => {
//             if (err) {
//                 res.status(500).send("Error writing file");
//                 return;
//             }
//             res.sendFile(path.join(__dirname, "modified_index.html"));
//         });
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });
