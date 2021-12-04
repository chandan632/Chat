const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");

// Setting public folder as a static file
app.use(express.static(path.join(__dirname, "public")));

// Serving HTML file
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

// Setting socket io connection and events
io.on("connection", (socket) => {
  console.log("A user connected");

  // When user leave the window
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // broadcasing message to all user
  socket.on("chatMessage", (msg) => {
    io.emit("broadcastMessage", msg);
  });

  // Typing start event
  socket.on("typingStart", (username) => {
    socket.broadcast.emit("broadcastTypingStart", username);
  });

  // Typing end event
  socket.on("typingEnd", (username) => {
    socket.broadcast.emit("broadcastTypingEnd", username);
  });
});

// Listening
server.listen(3000, () => console.log("App is up and running on port 3000"));
