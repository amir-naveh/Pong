const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '.')));

// Add middleware to ensure correct content type
app.use((req, res, next) => {
    if (path.extname(req.path) === '.html') {
        res.header('Content-Type', 'text/html');
    }
    next();
});

io.on('connection', (socket) => {
    console.log('A user connected');
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});
