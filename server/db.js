import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'langproj',
    process.env.DB_USER || 'languser',
    process.env.DB_PASSWORD || 'FGREXA6Qastar',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        dialectModule: mysql2,
        port: process.env.DB_PORT || 3306,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к MySQL успешно установлено');
        await sequelize.sync({ alter: true });
        console.log('Таблицы синхронизированы');
    } catch (error) {
        console.error('Ошибка подключения к MySQL:', error.message);
        console.error('Ошибка синхронизации:', error);
    }
})();

export default sequelize;