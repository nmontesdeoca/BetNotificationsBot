const Telegraf = require('telegraf');

const firebase = require('../firebase');
const players = require('../players');
const labanca = require('../labanca');

const {FIREBASE_URL, BOT_TOKEN, URL, PORT} = process.env;

const capitalize = text => text && (text[0].toUpperCase() + text.slice(1));

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
    bot.command('last', lastHandler);
    bot.command('set', setHandler);
    bot.command('when', whenHandler);
    bot.command('check', checkHandler);
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
    firebase.getNextPlayer()
        .then(player => context.reply(`${capitalize(player)}, no te olvides bolu!`));
}

function lastHandler(context) {
    firebase.getLastPlayer()
        .then(player => context.reply(`${capitalize(player)}, ahora tranqui`));
}

function setHandler(context) {
    Promise
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
                return 'No soy ningun gil';
            }

            nextPlayer = text[1].toLowerCase();

            if (!players.isValidPlayer(nextPlayer)) {
                return 'Si saben bien quienes son los jugadores, no jodan';
            }

            if (nextPlayer === currentNextPlayer) {
                return `${capitalize(nextPlayer)} ya es el próximo en jugar, ya te voy a agarrar a vos!`;
            }

            if (nextPlayer === currentLastPlayer) {
                return `${capitalize(nextPlayer)} fue el último en jugar, che ${capitalize(nextPlayer)} me parece que estos locos te quieren cagar`;
            }

            firebase.setNextPlayer(nextPlayer);
            firebase.setLastPlayer(currentNextPlayer);

            return 'Ok 👍';
        })
        .then(message => {
            context.reply(message);
        });
}

function whenHandler(context) {
    labanca.getNextDrawDate().then(when => context.reply(when));
}

function checkHandler(context) {
    firebase.getNumbers().then(numbers => {
        labanca.checkLastDraw(numbers).then(result => {
            // TODO: fix this fast result[0]
            context.reply(`Sorteo de la fecha: ${result[0].date}`);
            result.map(line => context.reply(`${line.numbers} - ${line.result}`));
        });
    });
}
