const errorHandler = (
    err,
    req,
    res,
    next
) => {

    console.error(err);

    return res.status(500).json({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message
    });
};

module.exports = errorHandler;