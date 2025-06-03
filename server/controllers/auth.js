import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registration = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });
        }

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(400).json({ message: 'Email уже занят' });
        }

        const user = await User.create(req.body);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};