import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import auth from './middlewares/auth.js';
import './models/User.js';
import dictionaryRoutes from './routes/dictionary.js';
import testResultsRoutes from './routes/testResults.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const app = express();

app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:5173',
    'https://langproj-production.up.railway.app'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.use('/api/dictionaries', dictionaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test-results', testResultsRoutes);

const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT}`);
});
