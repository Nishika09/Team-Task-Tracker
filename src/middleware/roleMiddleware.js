const authorize = (...roles) => {

    return (
        req,
        res,
        next
    ) => {

        const userRole =
            req.user.role;

        if (
            !roles.includes(userRole)
        ) {

            return res.status(403).json({
                status: 403,
                code: 'FORBIDDEN',
                message: 'Access denied'
            });
        }

        next();
    };
};

module.exports = authorize;