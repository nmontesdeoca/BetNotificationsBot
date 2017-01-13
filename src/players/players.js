let players;

module.exports = {
    setPlayers,
    isValidPlayer,
    getPlayer,
    getPlayerIndex
};

function setPlayers(result) {
    players = result;
}

function isValidPlayer(player) {
    return Boolean(players.find(currentPlayer => currentPlayer === player));
}

function getPlayer(index) {
    if (!players) {
        return null;
    }

    return players[index];
}

function getPlayerIndex(name) {
    if (!players) {
        return -1;
    }

    return players.findIndex(player => player === name);
}
