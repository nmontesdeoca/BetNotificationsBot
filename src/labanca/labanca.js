const request = require('request');
const env = require('jsdom').env;
const jQuery = require('jquery');

const HOST = 'www3.labanca.com.uy';
const DOMAIN = `http://${HOST}`;
const REFERER = `${DOMAIN}/resultados/cincodeoro`;
const RESULTS_URL = REFERER;
const VERIFY_URL = `${RESULTS_URL}/verificar`;
const VERIFY_TICKET_URL = `${RESULTS_URL}/verificar_jugada_boleta`;

module.exports = {
    getNextDrawDate,
    checkLastDraw,
    verifyTicket
};

/**
 * Get a promise that resolves with the date of the next draw
 * @return {Promise}
 */
function getNextDrawDate() {
    return new Promise(getNextDrawDateExecutor);
}

/**
 * Executor for getNextDrawDate function
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function getNextDrawDateExecutor(resolve, reject) {
    request(DOMAIN, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const match = body.match(/Próximo Sorteo: (\d{1,2}\/\d{2}\/\d{2,4})/);

            if (match && match.length && match[1]) {
                const dateRaw = match[1];
                const [day, month, year] = dateRaw.split('/');
                const date = new Date(`${[month, day, year].join('/')} 23:59:59`);
                const timestamp = date.getTime();

                resolve({
                    date: `${day}/${month}/${year}`,
                    timestamp
                });
            } else {
                resolve('Preguntale a la banca que no me quizo decir');
            }
        } else {
            reject(error, response);
        }
    });
}

/**
 * Get a promise that resolves to an object containing the result and/or prize won for the numbers provided
 * @param  {Array} numbers
 * @return {Promise}
 */
function checkLastDraw(numbers) {
    return new Promise(checkLastDrawExecutor.bind(this, numbers));
}

/**
 * Executor function for checkLastDraw function
 * @param  {Array} numbers
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function checkLastDrawExecutor(numbers, resolve, reject) {
    getAuthData()
        .then(authData => {
            const {authenticityToken, drawDate} = authData;

            const promises = numbers.map(number => verifyNumbers({
                number,
                authenticityToken,
                drawDate
            }));

            Promise.all(promises)
                .then(values => resolve(values), error => reject(error))
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}

/**
 * Get a promise that resolves with the result for a specific set of numbers
 * @param  {Object} options
 * @return {Promise}
 */
function verifyNumbers(options) {
    return new Promise(verifyNumbersExecutor.bind(this, options));
}

/**
 * Executor function for the verifyNumbers function
 * @param  {Object} options
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function verifyNumbersExecutor(options, resolve, reject) {
    const {authenticityToken, drawDate, number} = options;

    request.post({
        url: VERIFY_URL,
        headers: {
            'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
            'Accept-Language': 'es-419,es;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Host': HOST,
            'Referer': REFERER,
            'X-CSRF-Token': authenticityToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        form: {
            utf8: '✓',
            authenticity_token: authenticityToken,
            fecha_sorteo: drawDate,
            modalidad: 5,
            num1: number[0],
            num2: number[1],
            num3: number[2],
            num4: number[3],
            num5: number[4],
            num6: '',
            num7: '',
            num8: '',
            revancha: true,
            commit: 'Verificar'
        }
    }, (error, httpResponse, body) => {
        if (!error) {
            const partialBody = extractHTML(body);

            env(partialBody, (envError, window) => {
                if (!envError) {
                    const $ = jQuery(window);

                    resolve({
                        date: drawDate,
                        numbers: number.join(', '),
                        result: $('.result').text().trim()
                    });
                } else {
                    reject(envError)
                }
            });
        } else {
            reject(error, httpResponse);
        }
    });
}

/**
 * Get a promise that resolves with a token and a date
 * @return {Promise}
 */
function getAuthData() {
    return new Promise(getAuthDataExecutor);
}

/**
 * Executor function for the getAuthData function
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function getAuthDataExecutor(resolve, reject) {
    return request(RESULTS_URL, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            env(body, (errors, window) => {
                if (!errors) {
                    const $ = jQuery(window);
                    resolve({
                        authenticityToken: $('[name="authenticity_token"]').val(),
                        drawDate: $('[name="fecha_sorteo"]').val()
                    });
                } else {
                    reject(errors);
                }
            });
        } else {
            reject({
                error,
                response
            });
        }
    });
}

/**
 * Get a promise that resolves to an object containing the result and/or prize won for the ticketNumber provided
 * @param  {Number} ticketNumber
 * @return {Promise}
 */
function verifyTicket(ticketNumber) {
    return new Promise(verifyTicketExecutor.bind(this, ticketNumber));
}

/**
 * Executor function for verifyTicket
 * @param  {Number} ticketNumber
 * @param  {Promise.resolve} resolve
 * @param  {Promise.reject} reject
 * @return {void}
 */
function verifyTicketExecutor(ticketNumber, resolve, reject) {
    getAuthData()
        .then(authData => {
            const {authenticityToken, drawDate} = authData;

            request.post({
                url: VERIFY_TICKET_URL,
                headers: {
                    'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
                    'Accept-Language': 'es-419,es;q=0.8',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Host': HOST,
                    'Referer': REFERER,
                    'X-CSRF-Token': authenticityToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                form: {
                    fecha_sorteo: drawDate,
                    nro_boleta: ticketNumber
                }
            }, (error, httpResponse, body) => {
                if (!error) {
                    const partialBody = extractHTML(body);

                    env(partialBody, (envError, window) => {
                        if (!envError) {
                            const $ = jQuery(window);
                            const result = $('.resultado').text().trim() || $('.error').text().trim();

                            resolve({
                                date: drawDate,
                                ticketNumber,
                                result
                            });
                        } else {
                            reject(envError)
                        }
                    });
                } else {
                    reject(error, httpResponse);
                }
            });
        })
        .catch(error => console.error(error));
}

/**
 * extract the html embedded in labanca service response
 * @param  {String} body
 * @return {String}
 */
function extractHTML(body) {
    let partialBodyParts;

    if (!body) {
        return '';
    }

    partialBodyParts = body.split('.html(');

    if (!partialBodyParts || partialBodyParts.length < 2) {
        return body;
    }

    partialBodyParts = partialBodyParts[1].split(');');

    if (!partialBodyParts || !partialBodyParts.length) {
        return body;
    }

    return partialBodyParts[0]
        .replace(/\\n/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\\//g, '/');
}
