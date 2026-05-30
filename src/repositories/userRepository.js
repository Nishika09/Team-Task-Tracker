const pool = require('../config/db');

const getUserByEmail = async (email) => {

    const query = `
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
    `;

    const [rows] =
        await pool.execute(query, [email]);

    return rows[0];
};

const createUser = async ({
    name,
    email,
    passwordHash,
    role,
    organizationId
}) => {

    const query = `
        INSERT INTO users
        (
            name,
            email,
            password_hash,
            role,
            organization_id
        )
        VALUES
        (?, ?, ?, ?, ?)
    `;

    const [result] =
        await pool.execute(query, [
            name,
            email,
            passwordHash,
            role,
            organizationId
        ]);

    return {
        id: result.insertId,
        name,
        email,
        role,
        organizationId
    };
};

const getUserById = async (userId) => {

    const query = `
        SELECT *
        FROM users
        WHERE id = ?
        LIMIT 1
    `;

    const [rows] =
        await pool.execute(query, [userId]);

    return rows[0];
};

module.exports = {
    getUserByEmail,
    createUser,
    getUserById
};