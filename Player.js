const { DIRECTIONS, GAME_STATE, PIXEL_DISTANCE } = require('./constants');

class Player {
    constructor(socket, color, x, y) {
        this.socket = socket;
        this.nickname = null;
        this.id = socket.id;
        this.x = Math.floor(Math.random() * (800/5 + 1)) * 5;
        this.y = Math.floor(Math.random() * (800/5 + 1)) * 5;
        this.state = GAME_STATE.WAITING;
        this.direction = DIRECTIONS.RIGHT;
        this.trail = [];
        this.color = color;
        this.gameId = {};
    }

    getPlayerState() {
        return {
            id: this.id,
            nickname:  this.nickname,
            x: this.x,
            y: this.y,
            state: this.state,
            direction: this.direction,
            color: this.color,
            gameId: this.gameId
        }
    }

    updatePosition() {
        switch (this.direction) {
            case DIRECTIONS.UP:
                this.y -= PIXEL_DISTANCE;
                break;
            case DIRECTIONS.DOWN:
                this.y += PIXEL_DISTANCE;
                break;
            case DIRECTIONS.LEFT:
                this.x -= PIXEL_DISTANCE;
                break;
            case DIRECTIONS.RIGHT:
                this.x += PIXEL_DISTANCE;
                break;
        }
        this.trail.push({ x: this.x, y: this.y });
    }
}

module.exports = Player;
