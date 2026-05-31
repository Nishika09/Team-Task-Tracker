const taskRepository =
    require('../repositories/taskRepository');
const {
    redisClient
} = require(
    '../config/redis'
);
const allowedTransitions = {
    TODO: [
        'IN_PROGRESS',
        'BLOCKED'
    ],

    IN_PROGRESS: [
        'IN_REVIEW',
        'BLOCKED'
    ],

    IN_REVIEW: [
        'DONE',
        'BLOCKED'
    ],

    DONE: [],

    BLOCKED: []
};
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
    await redisClient.del(
        `tasks:assignee:${task.assignee_id}`
    );
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

    const cacheKey =
        `tasks:assignee:${filters.assigneeId || user.userId}`;
    const cached =
        await redisClient.get(
            cacheKey
        );

    if (cached) {

        return JSON.parse(
            cached
        );
    }
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

    await redisClient.set(
        cacheKey,
        JSON.stringify(result),
        {
            EX: 300
        }
    );

    return result;
};

const updateTaskStatus = async (
    taskId,
    newStatus,
    user
) => {

    const task =
        await taskRepository.getTaskById(
            taskId
        );

    if (!task) {
        throw new Error(
            'Task not found'
        );
    }

    const isManager =
        user.role === 'MANAGER';

    const isAssignee =
        task.assignee_id ===
        user.userId;

    if (
        !isManager &&
        !isAssignee
    ) {
        throw new Error(
            'You cannot update this task'
        );
    }

    const allowed =
        allowedTransitions[
        task.status
        ];

    if (
        !allowed.includes(
            newStatus
        )
    ) {
        throw new Error(
            `Invalid status transition from ${task.status} to ${newStatus}`
        );
    }

    await taskRepository
        .updateTaskStatus(
            taskId,
            newStatus
        );

    await redisClient.del(
        `tasks:assignee:${task.assignee_id}`
    );

    return {
        message:
            'Status updated successfully'
    };
};

const getTaskById = async (
    taskId,
    user
) => {

    const task =
        await taskRepository.getTaskById(
            taskId
        );

    if (!task) {
        throw new Error(
            'Task not found'
        );
    }

    if (
        user.role === 'MEMBER' &&
        task.assignee_id !== user.userId
    ) {
        throw new Error(
            'Access denied'
        );
    }

    return task;
};

const deleteTask = async (
    taskId,
    user
) => {

    const task =
        await taskRepository.getTaskById(
            taskId
        );

    if (!task) {
        throw new Error(
            'Task not found'
        );
    }

    if (
        task.organization_id !==
        user.organizationId
    ) {
        throw new Error(
            'Access denied'
        );
    }

    await redisClient.del(
        `tasks:assignee:${task.assignee_id}`
    );
    await taskRepository.deleteTask(
        taskId
    );

    return;
};

const assignTask = async (
    taskId,
    assigneeId,
    user
) => {

    const task =
        await taskRepository.getTaskById(
            taskId
        );

    if (!task) {

        throw new Error(
            'Task not found'
        );
    }

    const assignee =
        await userRepository.getUserById(
            assigneeId
        );

    if (!assignee) {

        throw new Error(
            'Assignee not found'
        );
    }

    if (
        assignee.organization_id !==
        user.organizationId
    ) {

        throw new Error(
            'Assignee must belong to same organization'
        );
    }

    await taskRepository.assignTask(
        taskId,
        assigneeId
    );

    return {
        message:
            'Task assigned successfully'
    };
};
module.exports = {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask,
    getTaskById,
    assignTask
};