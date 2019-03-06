# BetNotificationsBot
Simple Telegram Bot modular and super cool.

### Bot commands

* /start
* /who
* /set {name}
* /when
* /last
* /check
* /verify {ticketNumber} o {1} {2} {3} {4} {5}

### Development contribution

If you want to collaborate on this project, you need to follow the next steps:

1. clone this repo
2. execute in terminal to install dependencies: yarn (of you're still using npm, use "npm install")
3. talk to @BotFather inside Telegram to create a new bot and grab the "bot token"
4. create a Firebase Database and create an authentication user with email/password method
5. grab from Firebase the apiKey and the email and password for the auth user created
6. grab from here (Sample Firebase Data) the json to import into your firebase and import it
7. copy example.env to .env and fill in the variables with your values
8. to run the bot locally run "yarn start" (if you still using npm, "npm start")
9. open Telegram and talk to your bot, it is like a simple user, find it and talk to him :)
10. if you have any specific question related to this project, open an issue with your question ;)

### Modules

#### firebase

###### public
* login() - Do login and returns a Promise
* getPlayers() - Get a promise that resolves with the list of players
* getNextPlayer() - Get a promise that resolves with the index of the next player
* getLastPlayer() - Get a promise that resolves with the index of the last player
* getNextDrawDate() - Get a promise that resolves with the next draw date
* setNextDrawDate(nextDrawDate) - Set in firebase the next draw date
* setNextPlayer(index) - Set in firebase the next player
* setLastPlayer(index) - Set in firebase the last player
* getNumbers() - Get a promise that resolves with the list of our numbers

###### private
* getPlayersExecutor(resolve, reject) - Executor function for the getPlayers function
* getNextPlayerExecutor(resolve, reject) - Executor function for the getNextPlayer function
* getLastPlayerExecutor(resolve, reject) - Executor function for the getLastPlayer function
* getNextDrawDateExecutor(resolve, reject) - Executor function for the getNextDrawDate function
* getNumbersExecutor(resolve, reject) - Executor function for the getNumbers function
* getSnapshotValue(resolve, reject, path) - Common function to be used by the Executors

---
#### labanca

###### public
* getNextDrawDate() - Get a promise that resolves with the date of the next draw
* getLastDrawDate() - Get a promise that resolves with the date of the last draw
* checkLastDraw(numbers) - Get a promise that resolves to an object containing the result and/or prize won for the numbers provided
* verifyTicket(ticketNumber) - Get a promise that resolves to an object containing the result and/or prize won for the ticketNumber provided

###### private
* getNextDrawDateExecutor(resolve, reject) - Executor function for getNextDrawDate function
* getLastDrawDateExecutor(resolve, reject) - Executor function for getLastDrawDate function
* getAuthData() - Get a promise that resolves with a token and a date
* getAuthDataExecutor(resolve, reject) - Executor function for the getAuthData function
* verifyNumbers(options) - Get a promise that resolves with the result for a specific set of numbers
* verifyNumbersExecutor(options, resolve, reject) - Executor function for the verifyNumbers function
* checkLastDrawExecutor(numbers, resolve, reject) - Executor function for the checkLastDraw function
* verifyTicketExecutor(ticketNumber, resolve, reject) - Executor function for the verifyTicket function
* extractHTML(body) - extract the html embedded in labanca service response

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
* capitalize(text) - Capitalizes a text
* displayLastDrawResults(context, results) - Sends a message with the las draw results

---
#### players

###### public
* getPlayer(index) - Returns the name of the player at the specified index
* getPlayerIndex(name) - Returns the index of the player with the specified name
* setPlayers(result) - Set in a global players variable the players registered in firebase
* isValidPlayer(name) - Returns a boolean indicating if it is a valid player name

###### private
* None

## Directory structure:
```
├── src/
│   ├── bot
│   │   ├── bot.js
│   │   ├── index.js
│   ├── firebase
│   │   ├── firebase.js
│   │   ├── index.js
│   ├── labanca
│   │   ├── labanca.js
│   │   ├── index.js
│   ├── players
│   │   ├── players.js
│   │   ├── index.js
├── .gitignore
├── example.env
├── index.js
├── package.json
├── Procfile
├── README.md
├── yarn.lock
```

## Sample Firebase Data
```
{
  "lastPlayer" : 2,
  "nextDrawDate" : 1484524799000,
  "nextPlayer" : 0,
  "numbers" : [ [ 1, 2, 3, 4, 5 ], [ 6, 7, 8, 9, 10 ] ],
  "players" : [ "jorgito", "oreja", "braian" ]
}

```
