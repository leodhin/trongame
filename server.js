const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const { DIRECTIONS, GAME_STATE, SOCKET_EVENTS, PLAYER_COLORS, PIXEL_DISTANCE } = require('./constants');
const createSocketGame = require('./gameSocketEvents');
const { findGamePlayer } = require('./utils');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/game/:id', (req, res) => {
    const gameId = req.params.id;
    const fileName = `game.html`;
    const filePath = path.join(__dirname, 'public', fileName);

    // Send the file with the root option
    res.sendFile(fileName, { root: path.join(__dirname, 'public') }, (err) => {
        if (err) {
            // Handle the error if the file cannot be sent
            console.error(err);
            res.status(err.status).end();
        } else {
            //console.log(`Sent: ${fileName}`);
        }
    });
});

const PORT = process.env.PORT || 3000;

const game_namespace = io.of('/game');
const gameController = createSocketGame(game_namespace);

// Namespace general
io.on('connection', (socket) => {
    socket.on('requestRoomList', function() {
        const games = gameController.getGames();
        socket.emit('roomList', games);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
