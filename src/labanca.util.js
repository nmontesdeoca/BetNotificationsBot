var http = require('http');
var Q = require('q');
var querystring = require('querystring');
var env = require('jsdom').env;

module.exports = {
    getPostData: getPostData,
    isToday: isToday,
    request: makeRequest
};

//////////////////

function getPostData(authenticityToken, fechaSorteo, number) {
    var postData = querystring.stringify({
        utf8: '✓',
        authenticity_token: authenticityToken,
        fecha_sorteo: fechaSorteo,
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
    });

    return postData;
}

function makeRequest(options) {
    var deferred = Q.defer();
    var parseHTML = options.parseHTML;

    var request = http.request(options, function callback(response) {
        var body = '';

        response
            .on('data', function onData(chunk) {
                body += chunk;
            })
            .on('end', function onEnd() {
                if (parseHTML) {
                    env(body, function envBody(errors, window) {
                        var $ = require('jquery')(window);
                        deferred.resolve($);
                    });
                } else {
                    deferred.resolve(body);
                }
            });
    });

    if (options.postData && options.method === 'POST') {
        request.write(options.postData);
    }

    request.end();

    return deferred.promise;
}

function isToday(fechaSorteo) {
    var today = new Date();
    var fechaSorteoParsed = fechaSorteo.split('-');

    return today.getDate() === Number(fechaSorteoParsed[2]) &&
        today.getMonth() + 1 === Number(fechaSorteoParsed[1]) &&
        today.getFullYear() === Number(fechaSorteoParsed[0]);
}
