const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const msgObj = require('./messages');
const {userJoin, getCurrUser, userLeave, getRoomUsers} = require("./users");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = socketio(server);

// setting up port
const port = process.env.PORT || 3000;

// setting up static folder

const chatBot = "Bot";

// listen when new connection is made
io.on('connection', socket => {

  // when new user added
  socket.on("joinRoom", ({username, room}) => {

    // join the user to the room
    const user = userJoin(socket.id, username, room);
    socket.join(room);

    // Welcome new user
    socket.emit('message',msgObj(chatBot,"Welcome to discord app"));

    // Notify everyone a new user has joined
    socket.broadcast.to(room).emit('message', msgObj(chatBot,`${username} has joined the chat`));

    // Send updated users and room info
    io.to(room).emit("roomUsers", {
      room: room,
      users: getRoomUsers(room)
    });

    // when the user leaves
    socket.on('disconnect', ()=>{
      
      const user = userLeave(socket.id);
      if(user){
        // Notify everyone that a user has left
        socket.broadcast.to(room).emit('message', msgObj(chatBot, `${username} has left the chat`));
        // Send updated users and room info
        io.to(room).emit("roomUsers", {
          room: room,
          users: getRoomUsers(room)
        });
      }

    });

    // listening to chatMessage
    socket.on("chatMessage", chat => {
      io.to(user.room).emit('message', msgObj(chat.username, chat.message));
    });

  });

})

server.listen(port, ()=>console.log(`Server Running at port ${port}`));