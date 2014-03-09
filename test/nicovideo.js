var should = require('should');
var sinon = require('sinon');

var NV = require('../lib');

describe('nicovideo.js', function() {
    var nv, request;
    var sandbox;
    var spyCallback;
    var stubRequest;

    before(function(done) {
        nv = new NV();
        should.exist(nv);

        request = require('../lib/request');

        sandbox = sinon.sandbox.create();

        done();
    });

    beforeEach(function(done) {
        spyCallback = sandbox.spy();
        stubRequest = sandbox.stub(request, 'execute');

        done();
    });

    afterEach(function(done) {
        sandbox.restore();
        done();
    });

    describe('#getthumbinfo', function() {
        var response = {
            statusCode: 200,
        };

        it('OK with format', function(done) {
            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.getthumbinfo('videoId', 'xml', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);
            should.exist(args[2]);

            done();
        });

        it('OK without format', function(done) {
            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.getthumbinfo('videoId', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);
            should.exist(args[2]);

            done();
        });
    });

    describe('#thumb', function() {
        var response = {
            statusCode: 200,
        };

        it('OK', function(done) {
            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.thumb('videoId', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);
            should.exist(args[2]);

            done();
        });
    });

    describe('#getflv', function() {
        var response = {
            statusCode: 200,
        };

        it('OK', function(done) {
            var body = {
                thread_id: 'hogehoge',
            };
            stubRequest.yields(null, body, response);

            nv.getflv('videoId', 'nicosid', 'user_session', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);

            done();
        });
    });

    describe('#msg', function() {
        var response = {
            statusCode: 200,
        };
        var stubGetflv;

        beforeEach(function(done) {
            stubGetflv = sandbox.stub(nv, 'getflv');
            done();
        });

        it('OK with format', function(done) {
            var getflvResult = {
                thread_id: 'test',
                ms: 'http://localhost:3000/api/',
            }
            stubGetflv.yields(null, getflvResult);

            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.msg('videoId', 100, 'nicosid', 'user_session', 'xml', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);

            done();
        });

        it('OK without format', function(done) {
            var getflvResult = {
                thread_id: 'test',
                ms: 'http://localhost:3000/api/',
            }
            stubGetflv.yields(null, getflvResult);

            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.msg('videoId', 100, 'nicosid', 'user_session', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);

            done();
        });
    });

    describe('#getrelation', function() {
        var response = {
            statusCode: 200,
        };

        it('OK with format', function(done) {
            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.getrelation('videoId', 1, 'p', 'd', 'xml', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);
            should.exist(args[2]);

            done();
        });

        it('OK without format', function(done) {
            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.getrelation('videoId', 1, 'p', 'd', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);
            should.exist(args[2]);

            done();
        });
    });

    describe('#rss', function() {
        var response = {
            statusCode: 200,
        };

        it('OK', function(done) {
            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.rss('userId', 'video', 'atom', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);

            done();
        });
    });

    describe('#getheadline', function() {
        var response = {
            statusCode: 200,
        };

        it('OK with format', function(done) {
            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.getheadline('xml', spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);
            should.exist(args[2]);

            done();
        });

        it('OK without format', function(done) {
            var body = '<xml><hoge>test</hoge></xml>';
            stubRequest.yields(null, body, response);

            nv.getheadline(spyCallback);

            spyCallback.calledOnce.should.be.true;
            var args = spyCallback.args[0];
            should.not.exist(args[0]);
            should.exist(args[1]);
            should.exist(args[2]);

            done();
        });
    });
});
