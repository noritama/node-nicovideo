node-nicovideo
===

ニコニコ動画APIは公式に公開されているものではなく、まとまったドキュメントもないので、APIが用意されていて使えそうなものをnode.js製のライブラリにしました。

## install
    npm install node-nicovideo
    
## usage
    var NV = require('node-nicovideo');
    var nv = new NV();
    
### gethumbinfo
    nv.getthumbinfo(id, 'xml', callback);

### thumb
    nv.thumb(id, callback);
    
### getflv
    nv.getflv(id, 'nocosid', 'user_session', callback);
    
### msg
    nv.msg(id, 100, 'nicosid', 'user_session', 'xml', callback);
    
### getrelation
    nv.getrelation(id, 1, 'p', 'd', 'xml', callback);
    
### rss
    nv.rss(id, 'mylist', '2.0', callback);
    
### getheadline
    nv.getheadline('xml', callback);

### login
内部でpython cliをコールしてるためpython2.7以上がインストールされている必要があります。
    nv.login('your login mail addr', 'your password', callback);
