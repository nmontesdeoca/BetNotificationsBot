const firebase = require('./src/firebase');
const players = require('./src/players');
const bot = require('./src/bot');
const app = bot.createBot();

const {NODE_ENV} = process.env;

firebase.login()
    .then(() => {
        firebase.getPlayers()
            .then(result => players.setPlayers(result))
            .catch(error => console.error(error));
    })
    .catch(error => console.error(error));

// blah blah blah
bot.configureBot(app);
bot.configureCommands(app);

// magic starts to happen....now
bot.start(app);
// magic is in the past

console.log(`${NODE_ENV === 'production' ? 'BetNotificationsBot' : 'BetNotificationsTestBot'} started`);
