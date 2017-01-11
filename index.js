/**
 * proximos comandos
 *
 * /next - te dice la fecha del siguiente sorteo
 * /result - te dice el ultimo resultado disponible en la web junto con la fecha
 *
 */
const Telegraf = require('telegraf');
const Utils = require('./utils.js');
const app = new Telegraf(process.env.BOT_TOKEN);
const players = ['nico', 'carlos', 'caño'];

app.context.db = {
    previousPlayer: 'caño'
};

const whoCommandFunction = context => context.reply(Utils.findNextPlayer(context, players));
const setCommandFunction = context => context.reply(Utils.setLastPlayer(context, players));

app.command('start', context => context.reply('Hola 👋'));

app.command('who', whoCommandFunction);
app.hears(/a quien le toca/i, whoCommandFunction);

app.command('set', setCommandFunction);
app.hears(/(carlos|nico|caño) hizo la jugada/i, setCommandFunction);

app.startPolling();
