const taskService =
    require('../services/taskService');

const createTask = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await taskService.createTask(
                req.body,
                req.user
            );

        return res.status(201).json({
            status: 'success',
            data: result
        });

    } catch (error) {

        next(error);
    }
};

const getTasks = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await taskService.getTasks(
                req.query,
                req.user
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
    createTask,
    getTasks
};
