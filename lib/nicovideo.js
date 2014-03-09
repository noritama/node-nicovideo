var exec = require('child_process').exec;
var querystring = require('querystring');
var url = require('url');

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
 *     "rss": "http://www.nicovideo.jp"
 *   }
 * }
 */
function Nicovideo(options) {
    this.options = options || {};
    this.options.request = this.options.request || {
        timeout: 5000,
        maxSockets: 100,
        proxy: undefined,
    };
    this.options.url = this.options.url || {};
    this.options.url.ext = this.options.url.ext || 'http://ext.nicovideo.jp/';
    this.options.url.flapi = this.options.url.flapi || 'http://flapi.nicovideo.jp/';
    this.options.url.www = this.options.url.www || 'http://www.nicovideo.jp/';

    req.setup(this.options.request);
}

module.exports = Nicovideo;

function geturl() {
    var args = Array.prototype.slice.apply(arguments);
    var u = args.shift();
    var s = '';
    for (var i = 0; i < args.length; i++) {
        args[i] && (s += '/' + args[i]);
    }
    return url.resolve(u, s);
}

/**
 * 動画情報取得
 * @param {String} id  動画ID
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
 * @param {String} id  動画ID
 * @param {Function} cb
 */
Nicovideo.prototype.thumb = function(id, cb) {
    var u = geturl(this.options.url.ext, 'thumb', id);
    req.get(u, null, null, cb);
};

/**
 * FLV保管URL取得
 * @param {String} id  動画ID
 * @param {String} nicosid
 * @param {String} user_session
 * @param {Function} cb
 */
Nicovideo.prototype.getflv = function(id, nicosid, user_session, cb) {
    var u = geturl(this.options.url.flapi, 'api', 'getflv', id);
    var headers = {
        Cookie: 'nicosid=' + nicosid + '; user_session=' + user_session,
    };
    req.get(u, headers, null, function(err, result) {
        if (err) {
            return cb(err);
        }

        cb(null, querystring.parse(result));
    });
};

/**
 * コメント取得
 * @param {String} id  動画ID
 * @param {Number} num  コメント数
 * @param {String} nicosid
 * @param {String} user_session
 * @param {String} format  "json" or "xml" default: xml
 * @param {Function} cb
 */
Nicovideo.prototype.msg = function(id, num, nicosid, user_session, format, cb) {
    if (!cb) {
        cb = format;
        format = 'xml';
    }

    this.getflv(id, nicosid, user_session, function(err, result) {
        if (err) {
            return cb(err);
        }

        var threadId = result.thread_id;
        var msgAddr = result.ms;
        var headers = {
            'content-type': 'text/xml',
        };

        var data = '<thread res_from="-' + num + '" version="20061206" thread="' + threadId + '" />';
        req.post(msgAddr, data, headers, format || 'xml', function(err, result) {
            if (err) {
                return cb(err);
            }

            cb(null, result);
        });
    });
};

/**
 * 関連するオススメ動画取得
 * - 動画IDによってsortやorderが効かない場合がある
 * @param {String} id  動画ID
 * @param {Number} page  default:1
 * @param {String} sort  オススメ度:p/視聴数:v/コメント数:r/投稿日時:f/マイリスト登録数:m  default:p
 * @param {String} order  降順:d/昇順:a  default:d
 * @param {String} format  "json" or "xml" default: xml
 * @param {Function} cb
 */
Nicovideo.prototype.getrelation = function(id, page, sort, order, format, cb) {
    if (!cb) {
        cb = format;
        format = 'xml';
    }
    if (!id) {
        return callback(new Error('params error.'));
    }

    var u = geturl(this.options.url.flapi, 'api', 'getrelation');
    var params = {
        page: page || 1,
        sort: sort || 'p',
        order: order || 'd',
        video: id,
    };
    u += '?' + querystring.stringify(params);
    req.get(u, null, format || 'xml', cb);
};

/**
 * マイリスト・投稿動画のRSS(ATOM)取得
 * @param {Number} id  ユーザーID
 * @param {String} type  mylist or video
 * @param {String} format  atom or 2.0(rss) default: atom
 * @param {Function} cb
 */
Nicovideo.prototype.rss = function(id, type, format, cb) {
    var u = geturl(this.options.url.www, 'user', id, type);
    u += '?' + querystring.stringify({ rss: format });
    req.get(u, null, 'xml', cb);
};

/**
 * ヘッドライン取得
 * @param {String} format  "json" or "xml" default: xml
 * @param {Function} cb
 */
Nicovideo.prototype.getheadline = function(format, cb) {
    if (!cb) {
        cb = format;
        format = 'xml';
    }

    var u = geturl(this.options.url.www, 'api', 'getheadline');
    req.get(u, null, format || 'xml', cb);
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
