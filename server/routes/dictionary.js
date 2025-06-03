import express from 'express';
import { createDictionary} from '../models/Dictionary.js';
import { getDictionariesByUser } from '../models/Dictionary.js';
import { addWords } from '../models/Word.js';
import sequelize from '../db.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/', async (req, res) => {
    const { userId, name, words } = req.body;

    if (
        typeof userId !== 'number' ||
        typeof name !== 'string' ||
        !Array.isArray(words) ||
        words.some(w => typeof w.word !== 'string' || typeof w.translation !== 'string')
    ) {
        return res.status(400).json({ message: 'Некорректные данные' });
    }

    try {
        const dictionaryId = await createDictionary(userId, name);
        await addWords(dictionaryId, words);

        res.status(201).json({ id: dictionaryId, name, words });
    } catch (err) {
        console.error('Ошибка сервера:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        const dictionaries = await getDictionariesByUser(userId);
        res.json(dictionaries);
    } catch (err) {
        console.error('Ошибка при получении словарей:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.delete('/:id', async (req, res) => {
    const dictionaryId = req.params.id;
    const userId = req.query.userId;

    try {
        const dictionaries = await sequelize.query(
            'SELECT id FROM dictionaries WHERE id = ? AND user_id = ?',
            {
                replacements: [dictionaryId, userId],
                type: sequelize.QueryTypes.SELECT
            }
        );
        if (dictionaries.length === 0) {
            return res.status(404).json({ error: 'Словарь не найден или доступ запрещён' });
        }

        await sequelize.query('DELETE FROM test_results WHERE dictionary_id = ?', {
            replacements: [dictionaryId],
        });
        await sequelize.query('DELETE FROM words WHERE dictionary_id = ?', {
            replacements: [dictionaryId],
        });
        await sequelize.query('DELETE FROM dictionaries WHERE id = ?', {
            replacements: [dictionaryId],
        });

        res.status(200).json({ message: 'Словарь удалён' });
    } catch (err) {
        console.error('Ошибка при удалении словаря:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.put('/:id', async (req, res) => {
    const dictionaryId = req.params.id;
    const { name, words, userId } = req.body;

    if (!name || !Array.isArray(words) || !userId || !dictionaryId) {
        return res.status(400).json({ error: 'Недостаточно данных для обновления словаря' });
    }

    const t = await sequelize.transaction();

    try {
        await sequelize.query(
            'UPDATE dictionaries SET name = ? WHERE id = ? AND user_id = ?',
            {
                replacements: [name, dictionaryId, userId],
                type: sequelize.QueryTypes.UPDATE,
                transaction: t
            }
        );
        await sequelize.query(
            'DELETE FROM words WHERE dictionary_id = ?',
            {
                replacements: [dictionaryId],
                type: sequelize.QueryTypes.DELETE,
                transaction: t
            }
        );
        for (const word of words) {
            await sequelize.query(
                'INSERT INTO words (dictionary_id, word, translation) VALUES (?, ?, ?)',
                {
                    replacements: [dictionaryId, word.word, word.translation],
                    type: sequelize.QueryTypes.INSERT,
                    transaction: t
                }
            );
        }
        await t.commit();
        res.json({ message: 'Словарь и слова обновлены' });
    } catch (error) {
        await t.rollback();
        console.error('Ошибка при обновлении словаря:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.get('/ready-dictionaries', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/ready_dictionaries.json');
        const data = await readFile(filePath, 'utf-8');
        const dictionaries = JSON.parse(data);
        res.json(dictionaries);
    } catch (error) {
        console.error('Ошибка при чтении JSON:', error);
        res.status(500).json({ error: 'Ошибка загрузки словарей' });
    }
});

export default router;
