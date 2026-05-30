const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const userRepository = require('../repositories/userRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository')
const register = async (data) => {

    const {
        name,
        email,
        password,
        role,
        organizationId
    } = data;

    const existingUser =
        await userRepository.getUserByEmail(email);

    if (existingUser) {
        throw new Error('Email already exists');
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const createdUser =
        await userRepository.createUser({
            name,
            email,
            passwordHash: hashedPassword,
            role,
            organizationId
        });

    return createdUser;
};

const login = async (email, password) => {
    const user =
        await userRepository.getUserByEmail(email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const passwordMatched =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    if (!passwordMatched) {
        throw new Error('Invalid credentials');
    }

    const accessToken =
        generateAccessToken(user);

    const refreshToken =
        generateRefreshToken(user);


    const refreshTokenHash =
        crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

    const expiresAt =
        new Date(
            Date.now() +
            7 * 24 * 60 * 60 * 1000
        );

    await refreshTokenRepository
        .createRefreshToken({
            userId: user.id,
            tokenHash: refreshTokenHash,
            expiresAt
        });

    return {
        accessToken,
        refreshToken
    };
}

const refresh = async (
    incomingRefreshToken
) => {

    let payload;

    try {

        payload =
            verifyRefreshToken(
                incomingRefreshToken
            );

    } catch {

        throw new Error(
            'Invalid refresh token'
        );
    }

    const tokenHash =
        crypto
            .createHash('sha256')
            .update(incomingRefreshToken)
            .digest('hex');

    const storedToken =
        await refreshTokenRepository
            .getRefreshTokenByHash(
                tokenHash
            );

    if (!storedToken) {

        throw new Error(
            'Refresh token not found'
        );
    }

    const user =
        await userRepository
            .getUserById(
                payload.userId
            );

    if (!user) {

        throw new Error(
            'User not found'
        );
    }

    await refreshTokenRepository
        .deleteRefreshToken(
            tokenHash
        );

    const newAccessToken =
        generateAccessToken(user);

    const newRefreshToken =
        generateRefreshToken(user);

    const newTokenHash =
        crypto
            .createHash('sha256')
            .update(newRefreshToken)
            .digest('hex');

    const expiresAt =
        new Date(
            Date.now()
            + 7 * 24 * 60 * 60 * 1000
        );

    await refreshTokenRepository
        .createRefreshToken({
            userId: user.id,
            tokenHash: newTokenHash,
            expiresAt
        });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};
module.exports = {
    register,
    login,
    refresh
};