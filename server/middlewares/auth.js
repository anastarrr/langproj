import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Нет токена' });
    }

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Срок действия токена истёк',
                code: 'TOKEN_EXPIRED'
            });
        }
        return res.status(403).json({ message: 'Неверный токен' });
    }
};

export default auth;