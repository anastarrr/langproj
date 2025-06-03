import { DataTypes } from 'sequelize';
import db from '../db.js';

const TestResult = db.define('test_results', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dictionary_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correct_answer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'test_results'
});

export default TestResult;
