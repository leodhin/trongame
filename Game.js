const Player = require('./Player');
const { GAME_STATE, SOCKET_EVENTS, PLAYER_STATE } = require('./constants');
const { releaseColor, getRandomColor} = require('./utils');

class Game {
    constructor(io, room) {
        this.io = io;
        this.name = room;
        this.players = [];
        this.state = GAME_STATE.WAITING;
        this.tick = 0;
        this.gameInterval = null;
        this.PIXEL_DISTANCE = 5;
        this.TICK_RATE = 60;
        this.GAME_SPEED = 1000 / this.TICK_RATE;
        this.globalMap = {};
        this.usedColors = []
    }

    getInfo() {
        return {
            players: this.players.length,
            name: this.name,
        }
    }

    getGameState() {
        return {
            players: this.players.map(player => player.getPlayerState()),
            state: this.state,
            tick: this.tick
        }
    }

    addPlayer(socket, nickname) {
        const color = getRandomColor(this.usedColors);
        const newPlayer = this.state == GAME_STATE.PLAYING ? new Player(socket, color,0,0) : new Player(socket, color);
        newPlayer.state = PLAYER_STATE.WAITING;
        newPlayer.nickname = nickname;
        this.players.push(newPlayer);
        this.io.to(this.name).emit(SOCKET_EVENTS.SYNC_GAME_STATE, this.getGameState()); 
    }

    removePlayer(playerDisconnectedSocket) {
        if (playerDisconnectedSocket) {
            var playerLeft = this.players.filter(player => player.id == playerDisconnectedSocket.id)[0];
            this.usedColors = releaseColor(this.usedColors, playerLeft.color)
            this.players = this.players.filter(player => player.id !== playerDisconnectedSocket.id);
            // Revisar logica al desconectar un jugador, si esta el game en estado playing, por ejemplo
            if (this.players.length < 2) {
                this.state = GAME_STATE.WAITING;
            }
            this.io.to(this.name).emit(SOCKET_EVENTS.CLEAR);
            this.io.to(this.name).emit(SOCKET_EVENTS.SYNC_GAME_STATE, this.getGameState());
        }
    }

    startGame() {
        if (this.players.length >= 2) {
            let allPlayersReady = true;

            for (let player of this.players) {
                if (player.state !== PLAYER_STATE.READY) {
                    allPlayersReady = false;
                    break;
                }
            }

            if (allPlayersReady) {
                for (let player of this.players) {
                    player.state = PLAYER_STATE.PLAYING;
                }
                this.state = GAME_STATE.PLAYING;
                if (this.gameInterval) clearInterval(this.gameInterval);
                this.gameInterval = setInterval(() => this.gameLoop(), this.GAME_SPEED);
            }
        }
        this.io.to(this.name).emit(SOCKET_EVENTS.SYNC_GAME_STATE, this.getGameState());
    }

    pauseGame() {
        if (this.state === GAME_STATE.PLAYING) {
            this.state = GAME_STATE.PAUSED;
            this.io.to(this.name).emit(SOCKET_EVENTS.SYNC_GAME_STATE, this.getGameState());
        }
    }

    resumeGame() {
        if (this.state === GAME_STATE.PAUSED) {
            this.state = GAME_STATE.PLAYING;
            this.io.to(this.name).emit(SOCKET_EVENTS.SYNC_GAME_STATE, this.getGameState());
        }
    }

    endGame() {
        this.io.to(this.name).emit(SOCKET_EVENTS.GAME_OVER);
        this.state = GAME_STATE.FINISHED;
        this.tick = 0;
        this.globalMap = {};
        clearInterval(this.gameInterval);
  
        setTimeout(()=>{
            for (const player of this.players) {
                player.state = PLAYER_STATE.WAITING;
                player.x = Math.floor(Math.random() * (800/5 + 1)) * 5;
                player.y = Math.floor(Math.random() * (800/5 + 1)) * 5;
            }
            this.io.to(this.name).emit(SOCKET_EVENTS.CLEAR);
            this.io.to(this.name).emit(SOCKET_EVENTS.SYNC_GAME_STATE, this.getGameState());
        },3000);

       
    }

    gameLoop() {
        if (this.state === GAME_STATE.PLAYING) {  
            for (const player of this.players) {

                console.log('player '+player.id+'x:'+player.x+', y:'+player.y)
                player.updatePosition();

                if (this.checkCollision(player)) {
                    if (this.checkEndGame()){
                        var playerWinner = this.players.filter(player => player.state === PLAYER_STATE.PLAYING)[0];
                        playerWinner.state = PLAYER_STATE.FINISHED;
                        this.endGame();
                    }
                } 

                console.log('player '+player.id+'x:'+player.x+', y:'+player.y)
                let key = `${player.x},${player.y}`;
                this.globalMap[key] = true;

                player.trail.push({ x: player.x, y: player.y });

            }

            this.tick++;
            this.io.to(this.name).emit(SOCKET_EVENTS.SYNC_GAME_STATE, this.getGameState());
        }
    }

    checkCollision(player) {
            if (player.x < 0 || player.x >= 1195 || player.y < 0 || player.y >= 895) {
                player.state = PLAYER_STATE.FINISHED;
                return true;
            }

            let position = `${player.x},${player.y}`;

            if(this.globalMap[position]){
                console.log('me choque en'+position);
                player.state = PLAYER_STATE.FINISHED;
                return true;
            } 
        
        console.log('todo guay');
        return false;
    }

    checkEndGame() {
        return this.players.filter(player => player.state === PLAYER_STATE.PLAYING).length == 1;
    }

}

module.exports = Game;
