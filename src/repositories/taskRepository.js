const pool = require('../config/db');

const createTask = async ({
    title,
    description,
    priority,
    assigneeId,
    dueDate,
    createdBy,
    organizationId,
    status
}) => {

    const query = `
        INSERT INTO tasks
        (
            title,
            description,
            priority,
            assignee_id,
            due_date,
            created_by,
            organization_id,
            status
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] =
        await pool.execute(
            query,
            [
                title,
                description,
                priority,
                assigneeId,
                dueDate,
                createdBy,
                organizationId,
                status
            ]
        );

    return result.insertId;
};

const getTasks = async (
    user,
    filters,
    page,
    limit
) => {

    const offset =
        (page - 1) * limit;

    let whereClause = `
        WHERE organization_id = ?
    `;

    const params = [
        user.organizationId
    ];

    if (user.role === 'MEMBER') {

        whereClause += `
            AND assignee_id = ?
        `;

        params.push(
            user.userId
        );
    }

    if (filters.status) {

        whereClause += `
            AND status = ?
        `;

        params.push(
            filters.status
        );
    }

    if (filters.priority) {

        whereClause += `
            AND priority = ?
        `;

        params.push(
            filters.priority
        );
    }

    if (filters.assigneeId) {

        whereClause += `
            AND assignee_id = ?
        `;

        params.push(
            filters.assigneeId
        );
    }

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM tasks
        ${whereClause}
    `;

    const [countRows] =
        await pool.execute(
            countQuery,
            params
        );

    const total =
        countRows[0].total;

    const taskQuery = `
        SELECT *
        FROM tasks
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${Number(limit)}
        OFFSET ${Number(offset)}
    `;

    console.log('COUNT QUERY:', countQuery);
    console.log('TASK QUERY:', taskQuery);
    console.log('PARAMS:', params);

    const [tasks] =
        await pool.execute(
            taskQuery,
            params
        );

    return {
        tasks,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(
                total / limit
            )
        }
    };
};

module.exports = {
    createTask,
    getTasks
};