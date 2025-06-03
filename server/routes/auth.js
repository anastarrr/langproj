import express from 'express';
import bcrypt from 'bcrypt'
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/auth.js';
import { registration, login } from '../controllers/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            'your-secret-key',
            { expiresIn: '1h' }
        );
        res.json({ token, userId: user.id });

    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/registration', async (req, res) => {
    try {
        const { email, password, name, lastname, age, gender } = req.body;

        console.log("Получены данные:", req.body);

        const hashPassword = await bcrypt.hash(password, 5);

        const user = await User.create({
            email,
            password: hashPassword,
            name,
            lastname,
            age,
            gender
        });

        return res.json(user);
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.get('/api/profile', auth, async (req, res) => {
    try {
        const { id, name, lastname, email, age, gender } = req.user;
        res.json({ id, name, lastname, email, age, gender });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.patch('/api/profile', auth, async (req, res) => {
    try {
        const user = req.user;
        const { name, lastname, email, age, gender } = req.body;

        user.name = name;
        user.lastname = lastname;
        user.email = email;
        user.age = age;
        user.gender = gender;

        await user.save();

        res.json({ message: 'Профиль успешно обновлён' });
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении профиля' });
    }
});
export default router;