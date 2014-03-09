#!/usr/bin/env python
# coding: utf-8

# 引数のurlにアクセスしてresponse bodyを標準出力に返すプログラム

import argparse, cgi, cookielib, urllib, urllib2, sys

def main():
    try:
        parser = argparse.ArgumentParser(description='Get response body from an url')
        # 引数を追加
        parser.add_argument('mail', nargs=1)
        parser.add_argument('passwd', nargs=1)
        # 引数を解釈する
        args = parser.parse_args()
        mail = args.mail[0]
        passwd = args.passwd[0]

        cj = cookielib.CookieJar()
        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
        req = urllib2.Request("https://secure.nicovideo.jp/secure/login?site=niconico")
        req.add_data(urllib.urlencode({ "mail": mail, "password": passwd }))
        res = opener.open(req)
        str = "{"
        for cookie in cj:
            str += '"%s": "%s",' %(cookie.name, cookie.value)

        str = str.rstrip(',')
        str += "}"
        sys.stdout.write(str)
        return 0
    except urllib2.URLError, e:
        sys.stderr.write(str(e))
        return 1
    except urllib2.HTTPError, e:
        sys.stderr.write(str(e))
        return 1
    except:
        sys.stderr.write(str(sys.exc_info()[0]))
        return 1

if __name__ == '__main__':
    sys.exit(main())
