let players;

module.exports = {
    setPlayers,
    isValidPlayer,
    getPlayer,
    getPlayerIndex
};

/**
 * Set in a global players variable the players registered in firebase
 * @param {Array} result
 */
function setPlayers(result) {
    players = result;
}

/**
 * Returns a boolean indicating if it is a valid player name
 * @param  {String}  player
 * @return {Boolean}
 */
function isValidPlayer(player) {
    return Boolean(players.find(currentPlayer => currentPlayer === player));
}

/**
 * Returns the name of the player at the specified index
 * @param  {Number} index
 * @return {String}
 */
function getPlayer(index) {
    if (!players) {
        return 'unknown';
    }

    return players[index];
}

/**
 * Returns the index of the player with the specified name
 * @param  {String} name
 * @return {Number}
 */
function getPlayerIndex(name) {
    if (!players) {
        return -1;
    }

    return players.findIndex(player => player === name);
}
