/**
 * @fileOverview http request.
 * @name request.js
 * @author noritama <nori0123@gmail.com>
 * @license MIT
 */
var querystring = require('querystring');
var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

function Request() {
}

module.exports = new Request();

/**
 * Make the HTTP request options
 * @param {String} url example) http://example.com/xxx?access_token=xxxxx&...
 * @param {String} method http method
 * @param {Object} headers http header
 */
function makeOptions(url, method, headers) {
    var options = {
        uri: url,
        method: method,
        headers: headers,
        encoding: 'utf8',
        timeout: this.options.timeout,
        pool: { maxSockets: this.options.maxSockets },
        strictSSL: false,
    };

    if (this.options.proxy) {
        options.proxy = this.options.proxy;
    }

    return options;
}

/**
 * Parse the HTTP response data
 * @param {Object} body http response data
 * @param {Function} cb
 */
function parseJson(body, cb) {
    parser.parseString(body, function(err, result) {
        if (err) {
            var b;
            try {
                b = JSON.parse(body);
            } catch(err) {
                try {
                    b = querystring.parse(body);
                } catch(_err) {
                    b = body;
                }
            } finally {
                return cb(null, b);
            }
        }

        cb(null, result);
    });
}

/**
 * セットアップ
 * @param {Object} options
 */
Request.prototype.setup = function(options) {
    this.options = {
        timeout: options.timeout || 5000,
        maxSockets: options.maxSockets || 100,
        proxy: options.proxy,
    };
};

/**
 * HTTP get request.
 * @param {String} url
 * @param {Object} headers
 * @param {String} format // "json" or "xml"
 * @param {Function} cb
 */
Request.prototype.get = function(url, headers, format, cb) {
    var options = makeOptions.call(this, url, 'GET', headers);
    this.execute(options, format, cb);
};

/**
 * HTTP post request.
 * @param {String} url
 * @param {Object} data
 * @param {Object} headers
 * @param {String} format // "json" or "xml"
 * @param {Function} cb
 */
Request.prototype.post = function(url, data, headers, format, cb) {
    var options = makeOptions.call(this, url, 'POST', headers);

    if (headers && headers['content-type'] && headers['content-type'] === 'application/json') {
        options.json = data || {};
    } else if (typeof data === 'object') {
        options.form = data || {};
    } else {
        options.body = data || {};
    }

    this.execute(options, format, cb);
};

/**
 * HTTP delete request.
 * @param {String} url
 * @param {Object} headers
 * @param {String} format // "json" or "xml"
 * @param {Function} cb
 */
Request.prototype.delete = function(url, headers, format, cb) {
    var options = makeOptions.call(this, url, 'DELETE', headers);
    this.execute(options, format, cb);
};

/**
 * HTTP put request.
 * @param {String} url
 * @param {Object} data
 * @param {Object} headers
 * @param {String} format // "json" or "xml"
 * @param {Function} cb
 */
Request.prototype.put = function(url, data, headers, format, cb) {
    var options = makeOptions.call(this, url, 'PUT', headers);
    this.execute(options, format, cb);
};

/**
 * execute HTTP request.
 * @param {Object} options
 * @param {String} format // "json" or "xml"
 * @param {Function} cb
 */
Request.prototype.execute = function(options, format, cb) {
    console.info('request ', JSON.stringify(options));
    request(options, function(err, response, body) {
        if (err) {
            console.error(err.stack);
            return cb(err);
        }
        if (200 !== response.statusCode) {
            return cb(response.statusCode, body, response);
        }

        if (format !== 'json') {
            return cb(null, body, response);
        }

        parseJson(body, function(err, result) {
            cb(null, result, response);
        });
    });
};
