const socket = io("/game");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerId;
let localState = {};
let gameState = {};
let myPlayer = {};

// LATENCY PROBLEM
let inputSequence = 0;
const inputs = [];
let latency = 0;
let threshold = 5;
let pingStartTime = 0;
let roomList = {};
let currentRoom;
let selectedRoom;

const createRoomButton = document.getElementById('createRoomBtn');
const joinRoomButton = document.getElementById('joinRoomBtn');
const sendButton = document.getElementById('send-button');
const chatInput = document.getElementById('chat-input');
const startButton = document.getElementById('startButton');

const PLAYER_SPEED = 10;
const MAX_PLAYERS_PER_ROOM = 4;

// Update ping client
setInterval(measureLatency, 1000);


// Get the current URL of the webpage
const currentUrl = window.location.href;
// Split the URL by '/' to get an array of parts
const urlParts = currentUrl.split('/');
// Get the last part of the URL, which should be the game ID
const gameId = urlParts[urlParts.length - 1];



socket.emit('joinRoom', gameId, localStorage.getItem('nickname'));

/*
 ******************************************************************************
 *      This is a block separator for all the client socket events
 *
 ******************************************************************************
 */

 socket.on('error',() => {
    alert('ERROR - cant connect with server')
});

// CHAT GAME LOG, (DISCONNECT, CONNECT, USER CHATTING)
socket.on('playerConnected', (nickname) => {
    const message = `${nickname} connected.`;
    addTextToLogBox(message, "#55ACFF");
});

socket.on('playerDisconnected', (nickname) => {
    const message = ` ${nickname} disconnected.`;
    addTextToLogBox(message, "#FF5F55");
});

socket.on('pong', () => {
    const now = performance.now();
    latency = now - pingStartTime;
    latency = latency.toFixed(0);
    const pingElement = document.getElementById("ping");
    pingElement.textContent = `Ping  ${latency}`;
    pingStartTime = 0;
});

socket.on('state', (data) => {
    const message = `State of the game  ${data}.`;
    addTextToLogBox(message, "green");
});

socket.on('clear',() => {
    startButton.style.display = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

socket.on('syncGameState', (data) => {
    localState = data;
    drawPlayers();
    updateLobbyBox();
  });

socket.on('receiveMessage', (player, message) => {
    addTextToLogBox(player.nickname+': '+message, player.color);
});

socket.on('syncRooms', (rooms) => {
    this.roomList = rooms;
    roomList.innerHTML = '';
    Array.from(rooms).forEach(room => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${room.id}</strong> (${Object.keys(room.players).length/MAX_PLAYERS_PER_ROOM})`;
        li.classList.add('room-item');
        li.dataset.roomId = room.id;
        li.addEventListener('click', () => selectRoom(room.id, li));
        roomList.appendChild(li);

        const playerList = document.createElement('ul');
        for (let playerId in room.players) {
            const playerItem = document.createElement('li');
            playerItem.textContent = playerId;
            playerList.appendChild(playerItem);
        }
        li.appendChild(playerList);
    });
});


socket.on('gameOver', () => {
    //addTextToHeader(`Game Over!`);
    stopAudio();
    playGameover()
    addTextToLogBox(`Game Over!`);
    //cancelAnimationFrame(gameLoop);
});
  


/*
 ******************************************************************************
 *                  🎵 Audio tarin tarin tarin
 ******************************************************************************
 */

// Crear el elemento de audio
function createBackgroundMusic() {
    backgroundMusic = new Audio('../background-music.mp3');
    backgroundMusic.volume = 0.01;
    backgroundMusic.loop = true;
}

// Crear el elemento de audio
function createGameOverMusic() {
    gameoverMusic = new Audio('../game-over-music.mp3');
    gameoverMusic.volume = 0.02;
}

// Reproducir la música
function playBackground() {
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.error('Error al reproducir la música:', error);
        });
    }
}

// Reproducir la música
function playGameover() {
    if (gameoverMusic) {
        gameoverMusic.play().catch(error => {
            console.error('Error al reproducir la música:', error);
        });
    }
}

// Detener la música
function stopAudio() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reiniciar la música
    }
}

startButton.addEventListener('click', () => {
    socket.emit('ready');
    startButton.style.display = 'none';
    playBackground();
});

 // Chat input and sending messages
 sendButton.addEventListener('click', function() {
    const message = document.getElementById('chat-input').value;
    if (message.trim() !== '') {
        // Send the message to the server or log it in the game log
        const newMessage = document.createElement('div');
        newMessage.textContent = message;
        socket.emit('sendMessage', message);
        
        // Clear the input field after sending
        document.getElementById('chat-input').value = '';
        
        // Scroll to the bottom of the game log to show the new message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});

// Send message on pressing Enter key
chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('send-button').click();
    }
});

document.addEventListener('keydown', (event) => {
    const key_stroke = event.key;

    switch (key_stroke) {
        case 'ArrowUp': 
            socket.emit('move', 'up');
            break;
        case 'ArrowDown':
            socket.emit('move', 'down');
            break;
        case 'ArrowLeft':
            socket.emit('move', 'left');
            break;
        case 'ArrowRight':
            socket.emit('move', 'right');
            break;
    }

});

function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

function updatePlayerPosition(player) {
    switch (player.direction) {
        case DIRECTIONS.RIGHT:
            player.x += PLAYER_SPEED;          
            break;
        case DIRECTIONS.UP:
            player.y -= PLAYER_SPEED;
            break;
        case DIRECTIONS.DOWN:
            player.y += PLAYER_SPEED;
            break;
        case DIRECTIONS.LEFT:
            player.x -= PLAYER_SPEED;
            break;
        default:
            break;
    }
}

function measureLatency() {
    pingStartTime = performance.now();
    socket.emit('ping');
  }

function selectRoom(roomId, li) {
    selectedRoom = roomId;
    document.querySelectorAll('.room-item').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');
    joinRoomButton.disabled = false;
}

function addTextToLogBox(text, color) {
    const logBox = document.getElementById("log-box");
    const newText = document.createElement("p");
    newText.textContent = text;
    newText.style.color = color || "white";
    logBox.appendChild(newText);
}

function addTextToHeader(text, color) {
    const logBox = document.getElementById("header");
    const newText = document.createElement("h1");
    newText.textContent = text;
    newText.style.color = color || "white";
    logBox.appendChild(newText);
}

function addTextToLobbyBox(text, color) {
    const lobbyBox = document.getElementById("lobby-content");
    const newText = document.createElement("p");
    newText.textContent = text;
    newText.style.color = color || "white";
    lobbyBox.appendChild(newText);
}

function updateLobbyBox() {
    const lobbyBox = document.getElementById("lobby-content");
    lobbyBox.innerText = ''; // Clear the lobby box
    if (localState.players) {
        // Loop through the players and add each one to the lobby box
        for (let i = 0; i < localState.players.length; i++) {
            const player = localState.players[i];
            const text = `${player.nickname || player.id} ${player.state}`;
            addTextToLobbyBox(text, player.color);
        }
    }
}

function drawPlayers() {
    for (const id in localState.players) {
        const player = localState.players[id];
        console.log(localState.state);
        if(localState.state === GAME_STATE.PLAYING || localState.state === GAME_STATE.FINISHED){
            if(player.state === PLAYER_STATE.PLAYING || localState.state === GAME_STATE.FINISHED){
                ctx.fillStyle = player.color;
                ctx.fillRect(player.x, player.y, 5, 5);
            }   
        } else {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, 5, 5);
        }   
      }
}

window.onload = () => {
    createBackgroundMusic();
    createGameOverMusic();
};