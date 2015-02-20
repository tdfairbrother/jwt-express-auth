var authMiddleware = require('../');
var jwt = require('jsonwebtoken');
var expect = require('expect.js');
var sinon = require('sinon');

describe('jwt-express-auth', function(){

    describe('on setup it', function() {
        it('throws if secret not sent', function() {
            try {
                authMiddleware();
            } catch(e) {
                expect(e.message).to.be('Secret is not set');
            }
        });

        it('throws if tokenParam not sent', function() {
            try {
                authMiddleware({ secret:'test' });
            } catch(e) {
                expect(e.message).to.be('tokenParam is not set');
            }
        });
    });


    describe('when invoked', function() {
        var req, res, user1token, authorize;
        var mock;

        beforeEach(function() {
            req = { headers:{}, query:{}, body:{} };
            res = { status: function() {} };
            user1token = jwt.sign({ user_id: 1 }, 'secret');
            authorize = authMiddleware({ secret: 'secret', tokenParam: 'user_id' });
        });

        describe('sets status to 401 and calls back with error when', function() {

            function expectError(err) {
                expect(err).to.be.an(Error);
                expect(err.status).to.eql(401);
                mock.verify();
            }

            beforeEach(function() {
                mock = sinon.mock(res);
                mock.expects('status').once().withArgs(401);
            });

            it('no auth present', function() {
               authorize(req, res, expectError, 2);
            });

            it('authorization headers are malformed', function() {
                req.headers.authorization = user1token;
                authorize(req, res, expectError, 2);
            });

            it('unencrypted token does not match the authorization headers', function() {
                req.headers.authorization = 'Bearer '+user1token;
                authorize(req, res, expectError, 2);
            });

            it('unencrypted token does not match the authorization query param', function() {
                req.query.authorization = user1token;
                authorize(req, res, expectError, 2);
            });

            it('unencrypted token does not match the authorization body param', function() {
                req.body.authorization = user1token;
                authorize(req, res, expectError, 2);
            });
        });

        describe('continues when', function() {

            function expectSuccess(err) {
                expect(err).to.be(null);
                mock.verify();
            }

            beforeEach(function() {
                mock = sinon.mock(res);
                mock.expects('status').never();
            });

            it('unencrypted token matches the authorization headers', function() {
                req.headers.authorization = 'Bearer '+user1token;
                authorize(req, res, expectSuccess, 1);
            });

            it('unencrypted token matches the authorization query param', function() {
                req.query.authorization = user1token;
                authorize(req, res, expectSuccess, 1);
            });

            it('unencrypted token matches the authorization query param', function() {
                req.body.authorization = user1token;
                authorize(req, res, expectSuccess, 1);
            });
        });

    });

});