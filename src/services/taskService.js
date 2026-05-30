const taskRepository =
    require('../repositories/taskRepository');

const createTask = async (
    taskData,
    user
) => {

    const {
        title,
        description,
        priority,
        assigneeId,
        dueDate
    } = taskData;

    if (!title || !title.trim()) {
        throw new Error(
            'Title is required'
        );
    }

    if (
        !['LOW', 'MEDIUM', 'HIGH']
            .includes(priority)
    ) {
        throw new Error(
            'Invalid priority'
        );
    }

    if (
        dueDate &&
        new Date(dueDate) <= new Date()
    ) {
        throw new Error(
            'due_date must be a future date'
        );
    }

    const taskId =
        await taskRepository.createTask({
            title,
            description,
            priority,
            assigneeId,
            dueDate,
            createdBy:
                user.userId,
            organizationId:
                user.organizationId,
            status: 'TODO'
        });

    return {
        id: taskId
    };
};

const getTasks = async (
    queryParams,
    user
) => {

    const {
        page = 1,
        limit = 10,
        status,
        priority,
        assigneeId
    } = queryParams;

    const result =
        await taskRepository.getTasks(
            {
                organizationId:
                    user.organizationId,
                role:
                    user.role,
                userId:
                    user.userId
            },
            {
                status,
                priority,
                assigneeId
            },
            Number(page),
            Number(limit)
        );

    return result;
};

module.exports = {
    createTask,
    getTasks
};