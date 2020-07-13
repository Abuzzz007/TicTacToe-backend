const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json());

app.get('/',(req,res) => {
    res.send('Welcome to TicTacToe api');
});

const server = app.listen(5000, () => {
    console.log('Server started on port 5000');
})

const io = require('socket.io')(server);

io.use((socket, next) => {
    try {
        const user = socket.handshake.query.Username;
        socket.Username = user;
        next();
    } catch {}
});

io.on('connection', (socket) => {
    console.log('Connected: ' + socket.Username);

    socket.on('disconnect', () => {
        console.log('Disonnected: ' + socket.Username);    
    });

    socket.on('createRoom', ({ RoomId }) => {
        if(!io.sockets.adapter.rooms[RoomId]){
            socket.join(RoomId);
            console.log('A User has created room: ' + RoomId);
            io.emit('createRoomconf', {conf: true});
        } else {
            io.emit('createRoomconf', {conf: false});
            console.log('Room already exists');
        }
    });

    socket.on('joinRoom', ({ RoomId, username }) => {
        if(!io.sockets.adapter.rooms[RoomId]){
            io.emit('joinRoomconf', {conf: false});
            console.log('No such room');
        } else if(io.sockets.adapter.rooms[RoomId].length === 2) {
            io.emit('joinRoomconf', {conf: false});
            console.log('Limit reached');
        } else {
            socket.join(RoomId);
            io.emit('joinRoomconf', {conf: true});
            io.to(RoomId).emit('Partnername2', {username});
            console.log('A User has joined room: ' + RoomId);
        }
    });

    socket.on('Partnername1', ({RoomId, username}) => {
        io.to(RoomId).emit('Partnername1', {username});
    });

    socket.on('leaveRoom', ({ RoomId }) => {
        socket.leave(RoomId);
        console.log('A User has left room: ' + RoomId);

    });

    socket.on('Room_move', ({ RoomId, squares }) => {
        io.to(RoomId).emit('newMove', {squares});
    });
});