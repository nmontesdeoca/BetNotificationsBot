const {FIREBASE_URL, FIREBASE_USER_EMAIL, FIREBASE_USER_PASSWORD, FIREBASE_API_KEY} = process.env;

const firebase = require('firebase').initializeApp({
    apiKey: FIREBASE_API_KEY,
    databaseURL: FIREBASE_URL
});

module.exports = {
    login,
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
 * do login and returns the promise
 * @return {Promise}
 */
function login() {
    return firebase.auth().signInWithEmailAndPassword(FIREBASE_USER_EMAIL, FIREBASE_USER_PASSWORD);
}

/**
 * Get a promise that resolves with the list of players
 * @return {Promise}
 */
function getPlayers() {
    return new Promise(getPlayersExecutor);
}

/**
 * Executor function for the getPlayers function
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function getPlayersExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/players');
}

/**
 * Get a promise that resolves with the index of the next player
 * @return {Promise}
 */
function getNextPlayer() {
    return new Promise(getNextPlayerExecutor);
}

/**
 * Executor function for the getNextPlayer function
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function getNextPlayerExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/nextPlayer');
}

/**
 * Get a promise that resolves with the index of the last player
 * @return {Promise}
 */
function getLastPlayer() {
    return new Promise(getLastPlayerExecutor);
}

/**
 * Executor function for the getLastPlayer function
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function getLastPlayerExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/lastPlayer');
}

/**
 * Get a promise that resolves with the next draw date
 * @return {Promise}
 */
function getNextDrawDate() {
    return new Promise(getNextDrawDateExecutor);
}

/**
 * Executor function for the getNextDrawDate function
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
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
 * @param {String} index
 */
function setNextPlayer(index) {
    firebase.database().ref('/nextPlayer').set(index);
}

/**
 * Set in firebase the last player
 * @param {String} index
 */
function setLastPlayer(index) {
    firebase.database().ref('/lastPlayer').set(index);
}

/**
 * Get a promise that resolves with the list of our numbers
 * @return {Promise}
 */
function getNumbers() {
    return new Promise(getNumbersExecutor);
}

/**
 * Executor function for the getNumbers function
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function getNumbersExecutor(resolve, reject) {
    getSnapshotValue(resolve, reject, '/numbers');
}

/**
 * Common function to be used by the Executors
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @param  {String} path
 * @return {void}
 */
function getSnapshotValue(resolve, reject, path) {
    firebase.database().ref(path).once('value')
        .then(
            snapshot => resolve(snapshot.val()),
            error => reject(error)
        )
        .catch(error => console.error(error));
}
