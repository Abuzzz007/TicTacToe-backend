const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json());

app.get('/',(req,res) => {
    res.send('Welcome to TicTacToe api');
});

// const server = app.listen(process.env.PORT || 5000, () => {
const server = app.listen(5000, () => {
    console.log('Server started');
})

const io = require('socket.io')(server);
require('./Controllers/sockets')(io);