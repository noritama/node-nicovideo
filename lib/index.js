// ---------------
var Module = module.constructor;
var _load = Module.prototype.load;
var fs = require('fs');
var fileinfos = {};
Module.prototype.load = function(fn) {
    fileinfos[fn] = fs.statSync(fn).mtime.getTime();
    return _load.call(this, fn);
};

setInterval(function() {
    for (var fn in fileinfos) {
        if (fileinfos[fn] !== fs.statSync(fn).mtime.getTime()) {
            delete require.cache[fn];
        }
    }

    module.exports = require('./nicovideo');
    require('./request');
}, 1000);
// ---------------

module.exports = require('./nicovideo');
