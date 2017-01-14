const players = require('../players');

const {FIREBASE_URL, FIREBASE_USER_EMAIL, FIREBASE_USER_PASSWORD, FIREBASE_API_KEY} = process.env;

const firebase = require('firebase').initializeApp({
    apiKey: FIREBASE_API_KEY,
    databaseURL: FIREBASE_URL
});

firebase.auth()
    .signInWithEmailAndPassword(FIREBASE_USER_EMAIL, FIREBASE_USER_PASSWORD)
    .catch(error => console.error(error));

module.exports = {
    getPlayers,
    getNextPlayer,
    getLastPlayer,
    getNextDrawDate,
    setNextPlayer,
    setLastPlayer,
    setNextDrawDate,
    getNumbers
};

/**
 * Get a promise that resolves with the list of players
 * @return {Promise}
 */
function getPlayers() {
    return new Promise(getPlayersExecutor);
}

function getPlayersExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/players');
}

/**
 * Get a promise that resolves with the name of the next player
 * @return {Promise}
 */
function getNextPlayer() {
    return new Promise(getNextPlayerExecutor);
}

function getNextPlayerExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/nextPlayer', value => players.getPlayer(value));
}

/**
 * Get a promise that resolves with the name of the last player
 * @return {Promise}
 */
function getLastPlayer() {
    return new Promise(getLastPlayerExecutor);
}

function getLastPlayerExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/lastPlayer', value => players.getPlayer(value));
}

/**
 * Get a promise that resolves with the name of the last player
 * @return {Promise}
 */
function getNextDrawDate() {
    return new Promise(getNextDrawDateExecutor);
}

function getNextDrawDateExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/nextDrawDate');
}

/**
 * Set in firebase the next draw date
 * @param {Number} nextDrawDate timestamp
 */
function setNextDrawDate(nextDrawDate) {
    firebase.database().ref('/nextDrawDate').set(nextDrawDate);
}

/**
 * Set in firebase the next player
 * @param {String} name
 */
function setNextPlayer(name) {
    firebase.database().ref('/nextPlayer').set(players.getPlayerIndex(name));
}

/**
 * Set in firebase the last player
 * @param {String} name
 */
function setLastPlayer(name) {
    firebase.database().ref('/lastPlayer').set(players.getPlayerIndex(name));
}

/**
 * Get a promise that resolves with the list of our numbers
 * @return {Promise}
 */
function getNumbers() {
    return new Promise(getNumbersExecutor);
}

function getNumbersExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/numbers');
}

function getSnapshotValue(resolve, reject, path, processResultFunction) {
    firebase.database().ref(path).once('value')
        .then(
            snapshot => resolve(
                processResultFunction ?
                processResultFunction(snapshot.val()) :
                snapshot.val()
            ),
            error => reject(error)
        )
        .catch(error => console.error(error));
}
