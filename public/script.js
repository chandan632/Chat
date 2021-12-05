const loginForm = document.querySelector(".login");
const username = document.querySelector(".username");
const form = document.querySelector("#form");
const input = document.querySelector("#input");

// Join room form submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userName = username.value.trim();
  if (userName) {
    sessionStorage.setItem("username", userName);
    document.querySelector(".messageConatiner").style.display = "block";
    document.querySelector(".loginContainer").style.display = "none";
    input.focus();
    const socket = io({
      query: {
        username: userName,
      },
    });
    connectSocket(socket);
  }
});

// Listing all keys for which typing text will be not appear
const keys = [
  "Escape",
  "Tab",
  "Enter",
  "Alt",
  "CapsLock",
  "Backspace",
  "Delete",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "NumLock",
  "Insert",
  " ",
  "Control",
  "Shift",
];

const connectSocket = (socket) => {
  socket.on("userJoined", (username) => {
    console.log("user joined ", username);
    const statusBox = document.querySelector(".status");
    statusBox.innerText = `${username} joined`;
    setTimeout(() => {
      statusBox.innerText = "";
    }, 500);
  });

  // Getting broadcast message
  socket.on("broadcastMessage", (msg) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    if (sessionStorage.getItem("username") == msg.username) {
      messageDiv.classList.add("self");
    }

    const h6 = document.createElement("h6");
    h6.textContent = msg.username;
    h6.classList.add("name");

    const h4 = document.createElement("h4");
    h4.textContent = msg.message;
    h4.classList.add("name");

    messageDiv.appendChild(h6);
    messageDiv.appendChild(h4);

    document.querySelector("#messages").appendChild(messageDiv);

    window.scrollTo(0, document.querySelector("#messages").scrollHeight);
  });

  // Listening typing start socket event
  socket.on("broadcastTypingStart", (username) => {
    const statusBox = document.querySelector(".status");
    statusBox.innerText = `${username} is typing`;
  });

  // Listening typing end socket event
  socket.on("broadcastTypingEnd", (username) => {
    setTimeout(() => {
      const statusBox = document.querySelector(".status");
      statusBox.innerText = "";
    }, 1000);
  });

  // On key down event
  document.addEventListener("keydown", (e) => {
    console.log("ke", e);
    const style = document.querySelector(".messageConatiner").style.display;
    if (!keys.includes(e.key) && style != "none") {
      socket.emit("typingStart", sessionStorage.getItem("username"));
    }
  });

  // On key up event
  document.addEventListener("keyup", (e) => {
    const style = document.querySelector(".messageConatiner").style.display;
    if (!keys.includes(e.key) && style != "none") {
      socket.emit("typingEnd", sessionStorage.getItem("username"));
    }
  });

  // Message form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
      socket.emit("chatMessage", {
        username: sessionStorage.getItem("username"),
        message,
      });
    }
    input.value = "";
  });
};
