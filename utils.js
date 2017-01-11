const capitalize = text => text && (text[0].toUpperCase() + text.slice(1));

const fixPlayerIndex = (index, length) => {
    if (index >= length) {
        return 0;
    }
    return index;
}

const findNextPlayer = (context, players) => {
    const previousPlayer = context.db.previousPlayer;

    if (previousPlayer) {
        const previousPlayerIndex = players.findIndex(player => previousPlayer === player);
        const nextPlayerIndex = fixPlayerIndex(previousPlayerIndex + 1, players.length);

        return capitalize(players[nextPlayerIndex]);
    }

    return 'No se :/';
};

const setLastPlayer = (context, players) => {
    let player = context.match && context.match.length && context.match[1];

    // if there is no player we try to read it from the command /set
    if (!player) {
        const text = context.message && context.message.text;

        if (text) {
            player = text.split(' ')[1];
        }
    }

    if (player && ~players.indexOf(player.toLowerCase())) {
        context.db.previousPlayer = player;
        return 'Ok 👍';
    }

    return 'No se quien es :/ perdon';
};

module.exports = {
    fixPlayerIndex: fixPlayerIndex,
    findNextPlayer: findNextPlayer,
    setLastPlayer: setLastPlayer
};
