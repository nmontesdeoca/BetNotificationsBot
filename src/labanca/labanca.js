const request = require('request');
const env = require('jsdom').env;
const jQuery = require('jquery');

const firebase = require('../firebase');

const HOST = 'www3.labanca.com.uy';
const DOMAIN = `http://${HOST}`;
const REFERER = `${DOMAIN}/resultados/cincodeoro`;
const URL_RESULTADOS = REFERER;
const URL_VERIFICAR = `${URL_RESULTADOS}/verificar`;

module.exports = {
    getNextDrawDate,
    checkLastDraw
};

/**
 * Get a promise that resolves with the date of the next draw
 * @return {Promise}
 */
function getNextDrawDate() {
    // return firebase.getNextDrawDate();
    return new Promise((resolve, reject) => {
        firebase.getNextDrawDate().then(nextDrawDate => {
            if (nextDrawDate && Date.now() < nextDrawDate) {
                const date = new Date(nextDrawDate);
                const [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];

                resolve(`${day}/${month}/${year}`);
            } else {
                request(DOMAIN, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        const match = body.match(/Próximo Sorteo: (\d{1,2}\/\d{2}\/\d{2,4})/);

                        if (match && match.length && match[1]) {
                            const dateRaw = match[1];
                            const [day, month, year] = dateRaw.split('/');
                            const date = new Date(`${[month, day, year].join('/')} 23:59:59`);
                            const timestamp = date.getTime();

                            firebase.setNextDrawDate(timestamp);
                            resolve(`${day}/${month}/${year}`);
                        } else {
                            resolve('Preguntale a la banca que no me quizo decir');
                        }
                    } else {
                        reject(error, response);
                    }
                });
            }
        });
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

function checkLastDrawExecutor(numbers, resolve, reject) {
    getAuthData().then(authData => {
        const {authenticityToken, drawDate} = authData;

        const promises = numbers.map(number => verifyNumbers({
            number,
            authenticityToken,
            drawDate
        }));

        Promise.all(promises).then(
            values => resolve(values),
            error => reject(error)
        );
    });
}

function verifyNumbers(options) {
    return new Promise(verifyNumbersExecutor.bind(this, options));
}

function verifyNumbersExecutor(options, resolve, reject) {
    const {authenticityToken, drawDate, number} = options;

    request.post({
        url: URL_VERIFICAR,
        followAllRedirects: true,
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
            const regExp = /result\\">([^\/]*)/;
            const thereIsResult = regExp.test(body);
            let result;

            if (thereIsResult) {
                result = regExp.exec(body)[1].replace(/<br>?/g, '');

                resolve({
                    date: drawDate.replace(/-/g, '/'),
                    numbers: number.join(', '),
                    result: result
                });
            }
        } else {
            reject(error, httpResponse);
        }
    });
}

function getAuthData() {
    return new Promise(getAuthDataExecutor);
}

function getAuthDataExecutor(resolve, reject) {
    return request(URL_RESULTADOS, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            env(body, (errors, window) => {
                const $ = jQuery(window);
                resolve({
                    authenticityToken: $('[name="authenticity_token"]').val(),
                    drawDate: $('[name="fecha_sorteo"]').val()
                });
            });
        } else {
            reject({
                error,
                response
            });
        }
    });
}
