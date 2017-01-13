const Telegraf = require('telegraf');

const firebase = require('./src/firebase');

const {FIREBASE_URL, BOT_TOKEN, URL, PORT} = process.env;

module.exports = {
    createBot,
    configureBot,
    configureCommands,
    start
};

/**
 * Get a reference to the bot created
 * @return {Bot}
 */
function createBot() {
    return new Telegraf(BOT_TOKEN);
}

/**
 * Configure bot related things like name and webhook
 * @param  {Bot} bot
 * @return {void}
 */
function configureBot(bot) {
    bot.telegram.getMe().then(botInfo => (bot.options.username = botInfo.username));
    bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
}

/**
 * Configure commands to be handled
 * @param  {Bot} bot
 * @return {void}
 */
function configureCommands(bot) {
    bot.command('start', startHandler);
    bot.command('who', whoHandler);
    bot.command('set', setHandler);
    bot.command('when', whenHandler);
}

/**
 * Starts the webhook of the bot
 * @param  {Bot} bot
 * @return {void}
 */
function start(bot) {
    bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);
}

function startHandler(context) {
    context.reply('Hola 👋');
}

function whoHandler(context) {
    firebase.getNextPlayer().then(player => context.reply(player));
}

function setHandler(context) {
    Promises
        .all([
            firebase.getNextPlayer(),
            firebase.getLastPlayer()
        ])
        .then(([currentNextPlayer, currentLastPlayer]) => {
            // textRaw = '/set nico'
            const textRaw = context.message && context.message.text;
            const text = textRaw.split(' ');
            let nextPlayer;

            if (text.length !== 2) {
                return 'no soy ningun gil';
            }

            nextPlayer = text[1];

            if (!players.isValidPlayer(nextPlayer)) {
                return 'Si saben bien quienes son los jugadores, no jodan';
            }

            if (nextPlayer === currentNextPlayer) {
                return `${nextPlayer} ya es el próximo en jugar, ya te voy a agarrar a vos!`;
            }

            if (nextPlayer === currentLastPlayer) {
                return `${nextPlayer} fue el último en jugar, che ${nextPlayer} me parece
                    que estos locos te quieren cagar`;
            }

            firebase.setNextPlayer(nextPlayer);
            firebase.setLastPlayer(currentNextPlayer);

            return 'Ok 👍';
        })
        .then(message => {
            context.reply(message);
        });
    }
}

function whenHandler() {
    context => Utils.findNextDate().then(when => context.reply(when));
}