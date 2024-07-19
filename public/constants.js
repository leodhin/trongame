const DIRECTIONS = {
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down',
  LEFT: 'left',
};

SOCKET_EVENTS = {
  PLAYER_CONNECTED: 'playerConnected',
  PLAYER_DISCONNECTED: 'playerDisconnected',
  SYNC_GAME_STATE: 'syncGameState',
  CLEAR: 'clear',
  PING: 'ping',
  PONG: 'pong',
  MOVE: 'move',
  READY: 'ready',
  PAUSE: 'pause',
  RESUME: 'resume',
  END: 'end',
  GAMESTATE: 'gamestate',
  GAME_OVER: 'gameOver'
};

const GAME_STATE = {
  WAITING: 'waiting',
  READY: 'ready',
  FINISHED: 'finished',
  PLAYING: 'playing',
  PAUSED: 'paused'
};

const PLAYER_STATE = {
  WAITING: 'waiting',
  READY: 'ready',
  FINISHED: 'finished',
  PLAYING: 'playing'
};