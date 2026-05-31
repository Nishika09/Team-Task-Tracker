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

const updateTaskStatus =
    async (
        req,
        res,
        next
    ) => {

        try {

            const result =
                await taskService
                    .updateTaskStatus(
                        req.params.id,
                        req.body.status,
                        req.user
                    );

            res.status(200).json({
                status: 'success',
                data: result
            });

        } catch (error) {
            next(error);
        }
    };

const getTaskById = async (
    req,
    res,
    next
) => {

    try {

        const task =
            await taskService.getTaskById(
                req.params.id,
                req.user
            );

        res.status(200).json({
            status: 'success',
            data: task
        });

    } catch (error) {
        next(error);
    }
};

const deleteTask = async (
    req,
    res,
    next
) => {

    try {

        const taskId =
            req.params.id;

        await taskService.deleteTask(
            taskId,
            req.user
        );

        return res.status(200).json({
            status: 'success',
            message:
                'Task deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};
const assignTask = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await taskService.assignTask(
                req.params.id,
                req.body.assigneeId,
                req.user
            );

        res.status(200).json({
            status: 'success',
            data: result
        });

    } catch (error) {
        next(error);
    }
};
module.exports = {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask,
    getTaskById,
    assignTask
};
