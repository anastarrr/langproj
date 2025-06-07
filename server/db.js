import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import mysql2 from 'mysql2';

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectModule: mysql2,
        port: process.env.DB_PORT,
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