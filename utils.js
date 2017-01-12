const request = require('request');

const capitalize = text => text && (text[0].toUpperCase() + text.slice(1));

const fixPlayerIndex = (index, length) => {
    if (index >= length) {
        return 0;
    }
    return index;
}

const findNextPlayer = (context, players) => {
    const promise = new Promise((resolve, reject) => {
        context.db.child('previousPlayer').once('value').then(snapshot => {
            const previousPlayer = snapshot.val();

            if (previousPlayer) {
                const previousPlayerIndex = players.findIndex(player => previousPlayer === player);
                const nextPlayerIndex = fixPlayerIndex(previousPlayerIndex + 1, players.length);

                resolve(capitalize(players[nextPlayerIndex]));
            }

            resolve('No se :/');
        });
    });

    return promise;
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
        context.db.set({
            previousPlayer: player
        });
        return 'Ok 👍';
    }

    return 'No se quien es :/ perdon';
};

const findNextDate = () => {
    const promise = new Promise((resolve, reject) => {
        request('http://www.labanca.com.uy', (error, response, body) => {
            let match;

            if (!error && response.statusCode == 200) {
                match = body.match(/Próximo Sorteo: (\d{1,2}\/\d{2}\/\d{2,4})/);

                resolve(match && match.length && match[1] || 'Preguntale a la banca que no me quizo decir');
            }
        });
    });

    return promise;
};

module.exports = {
    findNextDate: findNextDate,
    fixPlayerIndex: fixPlayerIndex,
    findNextPlayer: findNextPlayer,
    setLastPlayer: setLastPlayer
};
