const { PLAYER_COLORS } = require('./constants');

function getRandomColor(usedColors) {
    if (PLAYER_COLORS.length === 0) {
      throw new Error('No more colors available');
    }
    
    var remainingColors = PLAYER_COLORS.filter(color => {
      return !usedColors.find(usedColor => usedColor === color)
    });

    const index = Math.floor(Math.random() * remainingColors.length);
    const color = remainingColors.splice(index, 1)[0];
    usedColors.push(color);
    return color;
}

function releaseColor(usedColors, color) {
    const index = usedColors.indexOf(color);
    if (index !== -1) {
      usedColors.splice(index, 1);
    } 
    return usedColors;
}

function findGamePlayer(players, socket) {
  if (players?.length > 0) {
    return players.find(player => player.id === socket.id);
  } else {
    return {};
  }

}

function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }

  return true;
}

module.exports = { getRandomColor, releaseColor, findGamePlayer, isEmpty };