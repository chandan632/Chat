const socket = io();

const loginForm = document.querySelector(".login");
const username = document.querySelector(".username");
const form = document.querySelector("#form");
const input = document.querySelector("#input");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userName = username.value.trim();
  if (userName) {
    sessionStorage.setItem("username", userName);
    document.querySelector(".messageConatiner").style.display = "block";
    document.querySelector(".loginContainer").style.display = "none";
    input.focus();
  }
});

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

document.addEventListener("keydown", (e) => {
  console.log("ke", e);
  console.log("down ", e.key);
  if (!keys.includes(e.key)) {
    socket.emit("typingStart", sessionStorage.getItem("username"));
  }
});

socket.on("broadcastTypingStart", (username) => {
  const typingBox = document.querySelector(".typing");
  typingBox.innerText = `${username} is typing`;
});

document.addEventListener("keyup", (e) => {
  if (!keys.includes(e.key)) {
    socket.emit("typingEnd", sessionStorage.getItem("username"));
  }
});

socket.on("broadcastTypingEnd", (username) => {
  setTimeout(() => {
    const typingBox = document.querySelector(".typing");
    typingBox.innerText = "";
  }, 1000);
});
