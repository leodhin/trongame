# 🕹️ TRON Game
![tron-gif](https://github.com/user-attachments/assets/fb2dd2b7-dc30-407e-922f-ac176b29902c)

Try it on http://tron-game.es/ ‼️

---
This project is a replica of the classic **TRON** game, developed using JavaScript for both client and server sides. It offers an engaging real-time multiplayer experience where players can join various rooms and compete against each other.

The objective is to gain an in-depth understanding of how latency delays can alter the flow of information and, consequently, the system's ability to react promptly, proposing mitigation and optimization strategies to improve the interaction between clients and servers.

## 🚀 Features

- 🎮 **Real-Time Multiplayer**: Players can join different rooms and compete in real-time matches.
- 🌐 **Client-Server Architecture**: Utilizes a robust client-server model to manage game state and player interactions.
- 📉 **Latency Analysis**: Focuses on studying and analyzing latency in client-server environments to understand its impact on decision-making in distributed systems.

## 🛠️ Installation

### Prerequisites

Ensure you have **Node.js** installed on your system.

### Clone the Repository

```sh
git clone https://github.com/leodhin/trongame.git
cd trongame
```

### Install Dependencies

```sh
npm install
```

## 🎯 Usage

To start the game server, run:

```sh
node server.js
```

- Players can connect to the game by navigating to `http://localhost:3000` in their web browsers.
- Use the on-screen interface to join or create game rooms and start playing.

## 🧠 How It Works

- The **server** (`server.js`) manages game state, player connections, and room assignments.
- **Client-side** code handles rendering the game and capturing player inputs.
- Communication between client and server is facilitated through WebSockets, enabling low-latency real-time interactions.
- The project includes tools to simulate and measure latency, analyzing its effects on gameplay and decision-making.

## 📂 Project Structure

```
├── server.js             # Main server script
├── Game.js               # Game logic and mechanics
├── Player.js             # Player class and related functionalities
├── Room.js               # Room management for multiplayer sessions
├── public/               # Client-side files (HTML, CSS, JS)
├── constants.js          # Game constants and configurations
├── gameSocketEvents.js   # WebSocket event handlers
├── utils.js              # Utility functions
├── package.json          # Project metadata and dependencies
└── package-lock.json     # Dependency tree lock file
```

## 🏗️ Future Improvements

- 🖥️ **Enhanced User Interface**: Improve the game's visual design and user experience.
- 🌍 **Online Deployment**: Deploy the game on a cloud platform for wider accessibility.
- 📊 **Advanced Latency Simulation**: Implement more sophisticated tools to simulate various network conditions and their impact on gameplay.

## 📜 License

This project is open-source and distributed under the **MIT License**.
