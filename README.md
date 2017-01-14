# BetNotificationsBot
Simple Telegram Bot modular and super cool.

### Development contribution
If you want to collaborate on this project, you need to follow the next steps:
...
To Be Continued
...

### Modules

#### firebase

###### public
* getPlayers() - Get a promise that resolves with the list of players
* getNextPlayer() - Get a promise that resolves with the name of the next player
* getLastPlayer() - Get a promise that resolves with the name of the last player
* getNextDrawDate() - Get a promise that resolves with the name of the last player
* setNextDrawDate(nextDrawDate) - Set in firebase the next draw date
* setNextPlayer(name) - Set in firebase the next player
* setLastPlayer(name) - Set in firebase the last player
* getNumbers() - Get a promise that resolves with the list of our numbers

###### private
* getPlayersExecutor(resolve, reject) - Executor function for the getPlayers function
* getNextPlayerExecutor(resolve, reject) - Executor function for the getNextPlayer function
* getLastPlayerExecutor(resolve, reject) - Executor function for the getLastPlayer function
* getNextDrawDateExecutor(resolve, reject) - Executor function for the getNextDrawDate function
* getNumbersExecutor(resolve, reject) - Executor function for the getNumbers function
* getSnapshotValue(resolve, reject, path, processResultFunction) - Common function to be used by the Executors

---
#### labanca

###### public
* getNextDrawDate() - Get a promise that resolves with the date of the next draw
* checkLastDraw(numbers) - Get a promise that resolves to an object containing the result and/or prize won for the numbers provided

###### private
* getAuthData() - Get a promise that resolves with a token and a date
* getAuthDataExecutor(resolve, reject) - Executor function for the getAuthData function
* verifyNumbers(options) - Get a promise that resolves with the result for a specific set of numbers
* verifyNumbersExecutor(resolve, reject) - Executor function for the verifyNumbers function
* checkLastDrawExecutor(resolve, reject) - Executor function for the checkLastDraw function

---
#### bot

###### public
* createBot() - Get a reference to the bot created
* configureBot(bot) - Configure bot related things like name and webhook
* configureCommands() - Configure commands to be handled
* start() - Starts the webhook of the bot

##### private
* startHandler(context) - Handler function for the start command
* whoHandler(context) - Handler function for the who command
* lastHandler(context) - Handler function for the last command
* setHandler(context) - Handler function for the set command
* whenHandler(context) - Handler function for the when command
* checkHandler(context) - Handler function for the check command

---
#### players

###### public
* getPlayer(index) - Get a promise that resolves with the name of the player at the specified index
* getPlayerIndex(name) - Get a promise that resolves with the index of the player with the specified name
* setPlayers(result) - Set in a global players variable the players registered in firebase
* isValidPlayer(name) - Returns a boolean indicating if it is a valid player name

###### private
* None

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
