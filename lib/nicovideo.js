var exec = require('child_process').exec;
var url = require('url');

var cookie = require('cookies');

var req = require('./request');

/**
 * Nicovideo api client module.
 * @param {Object} options
 * ex.)
 * {
 *   "request": {
 *     "timeout": 5000,
 *     "maxSockets": 100,
 *     "proxy": undefined
 *   },
 *   "url": {
 *     "ext": "http://ext.nicovideo.jp/",
 *     "flapi": "http://flapi.nicovideo.jp/",
 *     "msg": "http://msg.nicovideo.jp/",
 *     "rss": "http://www.nicovideo.jp"
 *   },
 *   "rss": "2.0" // or "atom"
 * }
 */
function Nicovideo(options) {
    this.options = options || {};
    req.setup(options.request);
}

module.exports = Nicovideo;

function geturl() {
    var args = Array.prototype.slice.apply(arguments);
    var u = args.shift();
    var s = '';
    for (var i = 0; i < args.length; i++) {
        s += '/' + args[i];
    }
    return url.resolve(u, s);
}

/**
 * 動画情報取得
 * @param {String} id  sm**
 * @param {String} format  "json" or "xml" default: xml
 * @param {Function} cb
 */
Nicovideo.prototype.getthumbinfo = function(id, format, cb) {
    if (!cb) {
        cb = format;
        format = 'xml';
    }

    var u = geturl(this.options.url.ext, 'api', 'getthumbinfo', id);
    req.get(u, null, format || 'xml', cb);
};

/**
 * HTML(iframe)取得
 * @param {String} id  sm**
 * @param {Function} cb
 */
Nicovideo.prototype.thumb = function(id, cb) {
    var u = geturl(this.options.url.ext, 'thumb', id);
    req.get(u, null, 'text', cb);
};

/**
 * FLV保管URL取得
 * @param {String} id  sm**
 * @param {String} nicosid
 * @param {String} user_session
 * @param {Function} cb
 */
Nicovideo.prototype.getflv = function(id, nicosid, user_session, cb) {
    var u = geturl(this.options.url.flapi, 'api', 'getflv', id);
    var headers = {
        Cookie: 'nicosid=' + nicosid + '; user_session=' + user_session,
    };
    req.get(u, headers, null, cb);
};

/**
 * ログイン
 * @param {String} mail
 * @param {String} password
 * @param {Function} cb
 */
Nicovideo.prototype.login = function(mail, password, cb) {
    exec('python ./lib/auth.py ' + mail + ' ' + password, function(err, stdout, stderr) {
        if (err) {
            return cb(err);
        }
        var result;
        try {
            result = JSON.parse(stdout);
        } catch (e) {
            err = e;
        } finally {
            cb(err, result);
        }
    });
};
