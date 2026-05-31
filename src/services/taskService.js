const taskRepository =
    require('../repositories/taskRepository');

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

    await taskRepository.deleteTask(
        taskId
    );

    return;
};
module.exports = {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask,
    getTaskById
};