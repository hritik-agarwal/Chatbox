const socket = io();
const chatForm = document.getElementById("message-form");
const messages = document.querySelector(".messages");

// getting username and room
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

// joinRoom
socket.emit("joinRoom", {username, room});

// adding user to users list
socket.on("roomUsers", ({room, users}) => {
  updateRoom(room);
  updateUsers(users);
});


// listening to message from server
socket.on('message', message=>{
  addMessage(message);
  messages.scrollTop = messages.scrollHeight;
})

// listening to message send in the chat box
chatForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const msg = e.target.querySelector('#msg').value;
  chatForm.querySelector("#msg").value = "";
  // sending chat message to server
  socket.emit('chatMessage', {username: username, message: msg });
})

// adding message to dom
function addMessage(message){
  const div = document.createElement('div');
  div.innerHTML = 
  `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.message}</p>
  `;
  div.classList.add("message");
  document.querySelector(".messages").appendChild(div);
}

// Updating Room
function updateRoom(room){
  document.querySelector(".room-name").innerHTML = room;
}

function updateUsers(users){
  document.querySelector(".users-name").innerHTML = "";
  for(let i=0; i<users.length; i++){
    const li = document.createElement("li");
    li.innerHTML = `${users[i].username}`;
    document.querySelector(".users-name").appendChild(li);
  }
}