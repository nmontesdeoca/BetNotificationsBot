# BetNotificationsBot
Simple Telegram Bot modular and super cool.

### Modules

#### firebase

###### public
* getPlayers() - Get a promise that resolves with the list of players
* getPlayer(index) - Get a promise that resolves with the name of the player at the specified index
* getPlayerIndex(name) - Get a promise that resolves with the index of the player with the specified name
* getNextPlayer() - Get a promise that resolves with the name of the next player
* getLastPlayer() - Get a promise that resolves with the name of the last player
* getNextDrawDate() - Get a promise that resolves with the name of the last player
* setNextDrawDate(nextDrawDate) - Set in firebase the next draw date
* setNextPlayer(name/index) - Set in firebase the next player
* setLastPlayer(name/index) - Set in firebase the last player
* getNumbers() - Get a promise that resolves with the list of our numbers

###### private
* save(path, data) - Save in the specified path the data provided

---
#### labanca

###### public
* getNextDrawDate() - Get a promise that resolves with the date of the next draw
* checkLastDraw(numbers) - Get a promise that resolves to an object containing the result and/or prize won for the numbers provided

###### private
* getAuthData() - Get a promise that resolves with a token and a date

---
#### bot

###### public
* createBot() - Get a reference to the bot created
* configureBot(bot) - Configure bot related things like name and webhook
* configureCommands() - Configure commands to be handled
* start() - Starts the webhook of the bot

##### private
* each command function

## Directory structure:
```
├── src/
│   ├── labanca.js
│   ├── bot.js
│   ├── firebase.js
├── .gitignore
├── index.js
├── package.json
├── README.md
├── yarn.lock
```
