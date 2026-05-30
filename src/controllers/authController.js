const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        res.status(201).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        res.status(201).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const refresh = async (
    req,
    res,
    next
) => {

    try {

        const {
            refreshToken
        } = req.body;

        const result =
            await authService.refresh(
                refreshToken
            );

        return res.status(200).json({
            status: 'success',
            data: result
        });

    } catch (error) {

        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh
};