const jwt = require('jsonwebtoken');

const authenticate = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 401,
                code: 'UNAUTHORIZED',
                message: 'Authorization header missing'
            });
        }

        const token =
            authHeader.split(' ')[1];

        const payload =
            jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET
            );

        req.user = payload;

        next();

    } catch (error) {

        return res.status(401).json({
            status: 401,
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authenticate;