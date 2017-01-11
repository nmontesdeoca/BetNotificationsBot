/**
 * proximos comandos
 *
 * /next - te dice la fecha del siguiente sorteo
 * /result - te dice el ultimo resultado disponible en la web junto con la fecha
 *
 */
const Telegraf = require('telegraf');
const { FIREBASE_URL, BOT_TOKEN, URL, PORT } = process.env;
const firebase = require('firebase').initializeApp({
    databaseURL: FIREBASE_URL
});
const Utils = require('./utils.js');
const app = new Telegraf(BOT_TOKEN);
const players = ['nico', 'carlos', 'caño'];

app.telegram.getMe().then(botInfo => (app.options.username = botInfo.username));
app.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
app.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);

app.context.db = firebase.database().ref('/data');

const whoCommandFunction = context => Utils.findNextPlayer(context, players).then(who => context.reply(who));
const setCommandFunction = context => context.reply(Utils.setLastPlayer(context, players));
const whenCommandFunction = context => Utils.findNextDate().then(when => context.reply(when));

app.command('start', context => context.reply('Hola 👋'));

app.command('who', whoCommandFunction);
app.hears(/a quien le toca/i, whoCommandFunction);

app.command('set', setCommandFunction);
app.hears(/(carlos|nico|caño) hizo la jugada/i, setCommandFunction);

app.command('when', whenCommandFunction);
app.hears(/cuando es el proximo sorteo/i, whenCommandFunction);
