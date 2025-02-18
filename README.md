## TRON Game
![tron-gif](https://github.com/user-attachments/assets/fb2dd2b7-dc30-407e-922f-ac176b29902c)

## Description

This project is a replica of the famous TRON game, developed using JavaScript on both the client and server side. The game allows players to join different rooms and compete in an exciting real-time multiplayer game.
It focuses on the study and analysis of latency in client-server environments, investigating how communication delays affect decision-making in distributed systems. Through simulations and experimental testing, the project aims to identify critical points where latency impacts performance, reliability, and user experience. The objective is to gain an in-depth understanding of how these delays can alter the flow of information and, consequently, the system's ability to react promptly, proposing mitigation and optimization strategies to improve the interaction between clients and servers.

## Features

- Real-time Multiplayer Gameplay**: Players can join rooms and compete against each other in real time.
- Room System**: List of rooms available to join, with information about the number of players and maximum capacity.
- Audio**: Background music and sound effects that stop when the game ends.
- Nickname persistence**: Players can save their nickname in `localStorage` for use in future sessions.

## Requirements

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone this repository:
    ````bash
    git clone https://github.com/tu-usuario/tron-game.git
    ```

2. Navigate to the project directory:
    ````bash
    cd tron-game
    ```

3. Install the dependencies:
    ````bash
    npm install
    ```

## Usage

1. Start the server:
    ````bash
    node server.js
    ```

2. Open your browser and navigate to `http://localhost:3000` to play.
   Or just try it on http://tron-game.es/ !!
