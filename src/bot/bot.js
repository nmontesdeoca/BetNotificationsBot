const Telegraf = require('telegraf');

const firebase = require('../firebase');
const players = require('../players');
const labanca = require('../labanca');

const {BOT_TOKEN, URL, PORT, NODE_ENV} = process.env;

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
    bot.telegram.getMe()
        .then(botInfo => (bot.options.username = botInfo.username))
        .catch(error => console.error(error));

    if (NODE_ENV === 'production') {
        bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
    }
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
    bot.command('verify', verifyHandler);
}

/**
 * Starts the webhook of the bot
 * @param  {Bot} bot
 * @return {void}
 */
function start(bot) {
    if (NODE_ENV === 'production') {
        bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);
    } else if (NODE_ENV === 'development') {
        bot.startPolling();
    } else {
        console.log(`NODE_ENV is ${NODE_ENV} and the bot is not started`);
    }
}

/**
 * Handler function for the start command
 * @param  {Object} context
 * @return {void}
 */
function startHandler(context) {
    context.reply('Hola 👋');
}

/**
 * Handler function for the who command
 * @param  {Object} context
 * @return {void}
 */
function whoHandler(context) {
    firebase.getNextPlayer()
        .then(index => players.getPlayer(index))
        .then(player => context.reply(`${capitalize(player)}, no te olvides bolu!`))
        .catch(error => console.error(error));
}

/**
 * Handler function for the last command
 * @param  {Object} context
 * @return {void}
 */
function lastHandler(context) {
    firebase.getLastPlayer()
        .then(index => players.getPlayer(index))
        .then(player => context.reply(`${capitalize(player)}, ahora tranqui`))
        .catch(error => console.error(error));
}

/**
 * Handler function for the set command
 * @param  {Object} context
 * @return {void}
 */
function setHandler(context) {
    Promise
        .all([
            firebase.getNextPlayer().then(index => players.getPlayer(index)).catch(error => console.error(error)),
            firebase.getLastPlayer().then(index => players.getPlayer(index)).catch(error => console.error(error))
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

            firebase.setNextPlayer(players.getPlayerIndex(nextPlayer));
            firebase.setLastPlayer(players.getPlayerIndex(currentNextPlayer));

            return 'Ok 👍';
        })
        .then(message => {
            context.reply(message);
        })
        .catch(error => console.error(error));
}

/**
 * Handler function for the when command
 * @param  {Object} context
 * @return {void}
 */
function whenHandler(context) {
    firebase.getNextDrawDate()
        .then(nextDrawDate => {
            if (nextDrawDate && Date.now() < nextDrawDate) {
                const date = new Date(nextDrawDate);
                const [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];

                context.reply(`${day}/${month}/${year}`);
            } else {
                labanca.getNextDrawDate()
                    .then(when => {
                        if (when.error) {
                            context.reply(when.message);
                        } else {
                            context.reply(when.date);
                            firebase.setNextDrawDate(when.timestamp);
                        }
                    })
                    .catch(error => console.error(error));
            }
        });
}

/**
 * Handler function for the check command
 * @param  {Object} context
 * @return {void}
 */
function checkHandler(context) {
    firebase.getNumbers()
        .then(numbers => {
            labanca.checkLastDraw(numbers)
                .then(results => displayLastDrawResults(context, results))
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}

/**
 * Handler function for the verify command
 * @param  {Object} context
 * @return {void}
 */
function verifyHandler(context) {
    const textRaw = context.message && context.message.text;
    const text = textRaw.split(' ');
    let ticketNumber;

    if (!text || (text.length !== 2 && text.length !== 6)) {
        context.reply('la idea era que uses /verify {ticketNumber} o {1} {2} {3} {4} {5}');
        return;
    }

    if (text.length === 2) {
        ticketNumber = text[1];

        labanca.verifyTicket(ticketNumber)
            .then(result => context.reply(result.result))
            .catch(error => console.error(error));
    } else {
         // text.length === 6
         let numbers = [text.slice(1)];

         labanca.checkLastDraw(numbers)
             .then(results => displayLastDrawResults(context, results))
             .catch(error => console.error(error));

    }
}

/**
 * Capitalizes a text
 * @param  {String} text
 * @return {String}
 */
function capitalize(text) {
    if (!text) {
        return '';
    }
    return `${text[0].toUpperCase()}${text.slice(1)}`;
}

/**
 * Sends a message with the las draw results
 * @param  {Object} context
 * @param  {Array} results
 * @return {void}
 */
function displayLastDrawResults(context, results) {
    // TODO: fix this fast results[0]
    context.reply(`Sorteo de la fecha: ${results[0].date}`)
        .then(() => results.map(result => context.reply(`${result.numbers} - ${result.result}`)))
        .catch(error => console.error(error));
}
