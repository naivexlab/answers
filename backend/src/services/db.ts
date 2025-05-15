import { Quiz, IQuiz, IQuestion } from '../models/quiz';
import mongoClient from '../utils/mongoClient';
import logger from '../utils/logger';

export class QuizDB {
    static async createQuiz(topic: string, questions: IQuestion[]): Promise<IQuiz> {
        try {
            const quizId = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
            const quizData = {
                quizId,
                topic,
                questions
            };
            
            const quiz = await mongoClient.create(Quiz, quizData);
            logger.info(`Created quiz with ID: ${quizId}`);
            return quiz;
        } catch (error) {
            logger.error('Error creating quiz:', { error: error });
            throw error;
        }
    }

    static async getQuizById(quizId: string): Promise<IQuiz | null> {
        try {
            const quiz = await mongoClient.findOne(Quiz, { quizId });
            if (!quiz) {
                logger.warn(`Quiz not found with ID: ${quizId}`);
            }
            return quiz;
        } catch (error) {
            logger.error(`Error fetching quiz with ID ${quizId}:`, { error: error });
            throw error;
        }
    }

    static async getQuizzesByTopic(topic: string): Promise<IQuiz[]> {
        try {
            const quizzes = await mongoClient.query(Quiz, { topic });
            return quizzes;
        } catch (error) {
            logger.error(`Error fetching quizzes for topic ${topic}:`, { error: error });
            throw error;
        }
    }
} 