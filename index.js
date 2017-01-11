/**
 * proximos comandos
 *
 * /next - te dice la fecha del siguiente sorteo
 * /result - te dice el ultimo resultado disponible en la web junto con la fecha
 *
 */
const Telegraf = require('telegraf');
const firebase = require('firebase').initializeApp({
    databaseURL: process.env.FIREBASE_URL
});
const Utils = require('./utils.js');
const app = new Telegraf(process.env.BOT_TOKEN);
const players = ['nico', 'carlos', 'caño'];

app.context.db = firebase.database().ref('/data');
app.context.db.set({
    previousPlayer: 'caño'
});

const whoCommandFunction = context => Utils.findNextPlayer(context, players).then(who => context.reply(who));
const setCommandFunction = context => context.reply(Utils.setLastPlayer(context, players));

app.command('start', context => context.reply('Hola 👋'));

app.command('who', whoCommandFunction);
app.hears(/a quien le toca/i, whoCommandFunction);

app.command('set', setCommandFunction);
app.hears(/(carlos|nico|caño) hizo la jugada/i, setCommandFunction);

app.startPolling();
