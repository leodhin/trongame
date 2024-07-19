class Room {
    constructor(id, room) {
        this.id = id;
        this.name = room;
        this.players = [];
        this.playerCount = 0;
    }

    getRoomState() {
        return {
            id: this.id,
            name: this.name,
            players: this.players,
            playerCount: this.playerCount
        }
    }

    addPlayerToRoom(playerId) {
        this.players.push(playerId);
        this.playerCount++;
    }

    removePlayerFromRoom(playerId) {
        delete this.players[playerId];
        this.playerCount--;
    }
}


module.exports = Room;