import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import auth from './middlewares/auth.js';
import './models/User.js';
import dictionaryRoutes from './routes/dictionary.js';
import testResultsRoutes from './routes/testResults.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/dictionaries', dictionaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test-results', testResultsRoutes);

app.get('/api/profile', auth, (req, res) => {
    res.json(req.user);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT}`);
});
