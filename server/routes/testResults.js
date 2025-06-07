import express from 'express';
import db from '../db.js';
import { QueryTypes } from 'sequelize';
import TestResult from '../models/TestResult.js';


const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, dictionaryId, results } = req.body;

    if (!userId || !dictionaryId || !Array.isArray(results)) {
        return res.status(400).json({ error: 'Некорректные данные' });
    }

    try {
        await TestResult.destroy({
            where: {
                user_id: userId,
                dictionary_id: dictionaryId
            }
        });
        const rowsToInsert = results.map(r => ({
            user_id: userId,
            dictionary_id: dictionaryId,
            question: r.question,
            answer: r.answer,
            correct_answer: r.correct_answer,
            is_correct: r.is_correct,
            created_at: new Date()
        }));

        await TestResult.bulkCreate(rowsToInsert);

        res.status(201).json({ message: 'Результаты теста сохранены' });
    } catch (error) {
        console.error('Ошибка при сохранении результатов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.get('/summary/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const summaries = await db.query(
            `SELECT 
                tr.dictionary_id,
                d.name AS dictionary_name,
                COUNT(*) as total_questions,
                SUM(CASE WHEN tr.is_correct THEN 1 ELSE 0 END) as correct_answers,
                MAX(tr.created_at) as last_test_date
             FROM test_results tr
             JOIN dictionaries d ON tr.dictionary_id = d.id
             WHERE tr.user_id = :userId
             GROUP BY tr.dictionary_id, d.name
             ORDER BY last_test_date DESC`,
            {
                replacements: { userId },
                type: QueryTypes.SELECT,
            }
        );

        const resultsWithPercent = summaries.map(item => ({
            dictionary_id: item.dictionary_id,
            dictionary_name: item.dictionary_name,
            total_questions: item.total_questions,
            correct_answers: item.correct_answers,
            percent_correct: ((item.correct_answers / item.total_questions) * 100).toFixed(2),
            last_test_date: item.last_test_date
        }));

        res.json(resultsWithPercent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при получении сводки результатов' });
    }
});

router.get('/details/:userId/:dictionaryId', async (req, res) => {
    const { userId, dictionaryId } = req.params;
    try {
        const results = await db.query(
            `SELECT question, correct_answer, answer AS user_answer, is_correct, created_at
       FROM test_results
       WHERE user_id = :userId AND dictionary_id = :dictionaryId
       ORDER BY created_at DESC
       LIMIT 50`,
            {
                replacements: { userId: Number(userId), dictionaryId: Number(dictionaryId) },
                type: QueryTypes.SELECT
            }
        );
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении деталей теста' });
    }
});


export default router;
