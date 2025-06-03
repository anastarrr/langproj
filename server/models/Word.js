import sequelize from '../db.js';

export async function addWords(dictionaryId, words) {
    for (const { word, translation } of words) {
        await sequelize.query(
            'INSERT INTO words (dictionary_id, word, translation) VALUES (?, ?, ?)',
            {
                replacements: [dictionaryId, word, translation],
                type: sequelize.QueryTypes.INSERT
            }
        );
    }
}

