const pool = require('../config/db');


const createRefreshToken = async ({
    userId,
    tokenHash,
    expiresAt
}) => {

    const query = `
        INSERT INTO refresh_tokens
        (
            user_id,
            token_hash,
            expires_at
        )
        VALUES
        (?, ?, ?)
    `;

    await pool.execute(query, [
        userId,
        tokenHash,
        expiresAt
    ]);
};

const getRefreshTokenByHash = async (tokenHash) => {

    const query = `
        SELECT *
        FROM refresh_tokens
        WHERE token_hash = ?
        LIMIT 1
    `;

    const [rows] =
        await pool.execute(query, [tokenHash]);

    return rows[0];
};

const deleteRefreshToken = async (tokenHash) => {

    const query = `
        DELETE FROM refresh_tokens
        WHERE token_hash = ?
    `;

    await pool.execute(
        query,
        [tokenHash]
    );
};

module.exports = {
    createRefreshToken,
    getRefreshTokenByHash,
    deleteRefreshToken
};