import sequelize from '../db.js';

export async function createDictionary(userId, name) {
    const [result] = await sequelize.query(
        'INSERT INTO dictionaries (user_id, name) VALUES (?, ?)',
        {
            replacements: [userId, name],
            type: sequelize.QueryTypes.INSERT
        }
    );
    return result;
}

export async function getDictionariesByUser(userId) {
    const dictionaries = await sequelize.query(
        'SELECT id, name FROM dictionaries WHERE user_id = ?',
        {
            replacements: [userId],
            type: sequelize.QueryTypes.SELECT,
        }
    );

    for (const dict of dictionaries) {
        const words = await sequelize.query(
            'SELECT word, translation FROM words WHERE dictionary_id = ?',
            {
                replacements: [dict.id],
                type: sequelize.QueryTypes.SELECT,
            }
        );
        dict.words = words;
    }
    return dictionaries;
}
