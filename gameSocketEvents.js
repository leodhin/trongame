const Game = require('./Game');

const { DIRECTIONS, GAME_STATE, SOCKET_EVENTS, PLAYER_COLORS, PIXEL_DISTANCE } = require('./constants');
const { findGamePlayer, isEmpty } = require('./utils');

function createGameSocket(io) {
    const existing_games = {};

    io.on('connection', (socket) => {
        
        let gameState =  {};
        
        socket.use((packet, next) => {
            const eventName = packet[0];

            // If is joining room
            if(eventName === SOCKET_EVENTS.JOIN_ROOM) {
                next();
            }

            // Does the player socket exist ?
            var player = findGamePlayer(gameState.players, socket);
            if (!isEmpty(player)) {
                next();
            }
           
        })
        socket.on(SOCKET_EVENTS.JOIN_ROOM, (room, nickname) => {
            console.log(gameState);

            socket.join(room);
            console.log(nickname+ `socket ${socket.id} has joined room ${room}`);

            const game = existing_games[room];

            // If game doesnt exist, create new one 
            // otherwise just add add the socket to the game as player
            if(!game) {
                let newGame = new Game(io, room);
                newGame.addPlayer(socket, nickname);
                existing_games[room] = newGame;
            } else {
                game.addPlayer(socket, nickname);
            }

            gameState = existing_games[room];

            io.to(room).emit(SOCKET_EVENTS.PLAYER_CONNECTED, nickname || socket.id);
        });

        socket.on(SOCKET_EVENTS.MOVE, (direction) => {
            const playerMoving = findGamePlayer(gameState.players, socket);
                
                switch (direction) {
                    case DIRECTIONS.UP:
                        if (playerMoving.direction != DIRECTIONS.DOWN) {
                            playerMoving.direction = direction;
                        }
                    break;
                    case DIRECTIONS.DOWN:
                        if (playerMoving.direction != DIRECTIONS.UP) {
                            playerMoving.direction = direction;
                        }
                    break;
                    case DIRECTIONS.LEFT:
                        if (playerMoving.direction != DIRECTIONS.RIGHT) {
                            playerMoving.direction = direction;
                        }
                    break;
                    case DIRECTIONS.RIGHT:
                        if (playerMoving.direction != DIRECTIONS.LEFT) {
                            playerMoving.direction = direction;
                        } 
                    break;
                    default:
                        playerMoving.direction = direction;
                    break;
                }
        });

        socket.on('disconnect', () => {
            socket.leaveAll(); // Esto asegura que el socket salga de todas las salas
            var playerRemoved = findGamePlayer(gameState.players, socket);

            if(isEmpty(playerRemoved)) return;

            gameState.removePlayer(socket);

            io.to(gameState.name).emit(SOCKET_EVENTS.PLAYER_DISCONNECTED, playerRemoved.nickname);   

            for (const gameId in existing_games) {
                if (existing_games[gameId].players.length === 0) {
                    delete existing_games[gameId];
                }
            }
        })  
        
        socket.on(SOCKET_EVENTS.READY, () => {
            const player = findGamePlayer(gameState.players, socket);
            player.state = 'ready';
            gameState.startGame();
        });


        socket.on(SOCKET_EVENTS.PAUSE, () => {
        if (gameState.state === GAME_STATE.PLAYING) {
            gameState.state = GAME_STATE.PAUSED;
            io.to(gameState.name).emit(SOCKET_EVENTS.STATE, gameState.getGameState());
        }
        });

        socket.on(SOCKET_EVENTS.RESUME, () => {
        if (gameState.state === GAME_STATE.PAUSED) {
            gameState.state = GAME_STATE.PLAYING;
            io.to(gameState.name).emit(SOCKET_EVENTS.STATE, gameState.getGameState());
        }
        });

        socket.on(SOCKET_EVENTS.END, () => {
            gameState.state = GAME_STATE.FINISHED;
            io.to(gameState.name).emit(SOCKET_EVENTS.STATE, gameState.getGameState());
        }); 

        socket.on(SOCKET_EVENTS.PING, () => {
            socket.emit(SOCKET_EVENTS.PONG);
        }); 

        socket.on(SOCKET_EVENTS.SEND_MESSAGE, (message) => {
            var player = findGamePlayer(gameState.players, socket);
            io.to(gameState.name).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, player.getPlayerState(), message);
        }); 

    });

    return {
       getGames() {
            // Ensure existing_games is an object
            if (typeof existing_games !== 'object' || existing_games === null) {
                console.log("existing games is not an object.");
                return [];
            }
        
            // Convert the object to an array of game instances
            const gameArray = Object.values(existing_games);
        
            // Map over the array to get the game info
            const games = gameArray.map((game, index) => {
                if (game && typeof game.getInfo === 'function') {
                    const info = game.getInfo();
                    console.log(`game info for game at index ${index}:`, info);
                    return info;
                } else {
                    console.error(`Game at index ${index} is not properly initialized or getInfo is not a function.`);
                    return null;
                }
            });
        
            return games;
        }
    };
}

module.exports = createGameSocket;