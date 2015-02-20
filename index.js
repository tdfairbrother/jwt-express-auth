var jwt = require('jsonwebtoken');

module.exports = function(options) {
    if (!options || !options.secret) throw new Error('Secret is not set');
    if (!options || !options.tokenParam) throw new Error('tokenParam is not set');

    var tokenParam = options.tokenParam;

    return function authMiddleware(req, res, next, userId) {
        var token = getAuthFromQueryParam() || getAuthFromBody() || getAuthFromHeader();

        if (token) {
            return jwt.verify(token, options.secret, options, validateUserToken);
        } else {
            return unauthorized('No Authorization Found');
        }



        function validateUserToken(err, decryptedUser) {
            if (err || !userMatch(decryptedUser)) {
                return unauthorized('Invalid Token');
            } else {
                return next(null);
            }
        }

        function unauthorized(message) {
            var error = new Error();
            error.message = message;
            error.status = 401;
            res.status(401);
            return next(error);
        }

        function getAuthFromHeader() {
            if (req.headers && req.headers.authorization) {
                var parts = req.headers.authorization.split(' ');
                if (parts.length == 2) {
                    if (/^Bearer$/i.test(parts[0])) {
                        return parts[1];
                    }
                }
            }
            return false;
        }

        function getAuthFromQueryParam() {
            if (req.query.authorization) {
                return req.query.authorization;
            }
            return false;
        }

        function getAuthFromBody() {
            if (req.body && req.body.authorization) {
                return req.body.authorization;
            }
            return false;
        }

        function userMatch(decryptedUser) {
            return String(decryptedUser[tokenParam]) === String(userId);
        }

    };
};

