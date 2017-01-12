const Q = require('q');
const utils = require('./labanca.utils.js');
const NUMBERS = [
    [7, 19, 22, 33, 36],
    [1, 2, 11, 13, 35],
    [3, 17, 18, 29, 31]
];
const HOST = 'www3.labanca.com.uy';
const PATH_RESULTADOS = '/resultados/cincodeoro';
const PATH_VERIFICAR = PATH_RESULTADOS + '/verificar';

fetchData().then(checkNumbers);

///////////////////////////

function fetchData() {
    var deferred = Q.defer();

    var options = {
        hostname: HOST,
        path: PATH_RESULTADOS,
        parseHTML: true
    };

    utils.request(options).then(function thenRequest($) {
        var authenticityToken = $('[name="authenticity_token"]').val();
        var fechaSorteo = $('[name="fecha_sorteo"]').val();
        var result = {
            authenticityToken: authenticityToken,
            fechaSorteo: fechaSorteo
        };
        deferred.resolve(result);
    });

    return deferred.promise;
}

function checkNumbers(data) {
    var promises = [];

    if (!utils.isToday(data.fechaSorteo)) {
        return;
    }

    NUMBERS.forEach(checkNumber.bind(this, data.authenticityToken, data.fechaSorteo, promises));
}

function checkNumber(authenticityToken, fechaSorteo, promises, number, index) {
    var deferred = Q.defer();
    var postData = utils.getPostData(authenticityToken, fechaSorteo, number);
    var options = {
        hostname: HOST,
        path: PATH_VERIFICAR,
        method: 'POST',
        postData: postData,
        headers: {
            'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
            'Accept-Language': 'es-419,es;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length': postData.length,
            'Host': HOST,
            'Referer': 'http://www3.labanca.com.uy/resultados/cincodeoro',
            'X-CSRF-Token': authenticityToken,
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    utils.request(options).then(function thenRequest(body) {
        var regExp = /result\\">([^\/]*)/;
        var thereIsResult = regExp.test(body);
        var result;

        if (thereIsResult) {
            result = regExp.exec(body)[1].replace(/<br>?/g, '');

            deferred.resolve({
                numbers: number.join(', '),
                result: result
            });
        }
    });

    promises.push(deferred.promise);

    if (index + 1 === NUMBERS.length) {
        Q.all(promises).then(function () {
            console.log(arguments);
        });
    }
}
