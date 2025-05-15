import express from 'express';
import cors from 'cors';
import { config } from './config';
import logger from './utils/logger';
import quizRoutes from './routes/quizRoutes';

const app = express();

// Middleware
app.use(cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api/backend', quizRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error'
    });
});

export default app;