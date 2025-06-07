import jwt from 'jsonwebtoken';

export function generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
}

export function generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}