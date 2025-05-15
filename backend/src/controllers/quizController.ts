import { Request, Response } from 'express';
import { QuizDB } from '../services/db';
import llmService from '../services/llmService';
import logger from '../utils/logger';
import { validationResult } from 'express-validator';

export class QuizController {
    static async generateQuiz(req: Request, res: Response) {
        try {
            const { topic } = req.query;
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ message: errors.array().join(", ") });
                return
            }

            if (!topic || typeof topic !== 'string') {
                res.status(400).json({
                    message: 'Quiz Topic is required and must be a string'
                });
                return
            }

            const quizData = await llmService.generateQuiz(topic);
            
            if (!quizData || !quizData.questions || quizData.questions.length == 0) {
                res.status(529).json({
                    message: 'Quiz generation not available'
                });
                return
            }
            const quiz = await QuizDB.createQuiz(topic, quizData.questions);
            
            const quizResponse = {
                quizId: quiz.quizId,
                questions: quiz.questions.map(q => ({
                    id: q.id,
                    text: q.text,
                    options: q.options
                }))
            };

            res.json(quizResponse);
        } catch (error) {
            logger.error('Error in generateQuiz:', {error: error});
            res.status(500).json({
                message: 'Failed to generate quiz'
            });
        }
    }

    static async gradeQuiz(req: Request, res: Response) {
        try {
            const { quizId } = req.query;
            const { answers } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ message: errors.array().join(", ") });
                return
            }

            if (!quizId || typeof quizId !== 'string') {
                res.status(400).json({
                    message: 'Quiz ID is required and must be a string'
                });
                return
            }

            if (!answers || typeof answers !== 'object') {
                res.status(400).json({
                    mesage: 'Answers are required and must be an object'
                });
                return
            }

            const quiz = await QuizDB.getQuizById(quizId);
            if (!quiz) {
                res.status(404).json({
                    message: 'Quiz not found'
                });
                return
            }

            // grading
            let correctCount = 0;
            const feedback = quiz.questions.map(question => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.answer;
                if (isCorrect) correctCount++;

                return {
                    id: question.id,
                    yourAnswer: userAnswer || null,
                    correctAnswer: question.answer
                };
            });

            res.json({
                correct: correctCount,
                total: quiz.questions.length,
                feedback
            });
        } catch (error) {
            logger.error('Error in gradeQuiz:', { error: error });
            res.status(500).json({
                message: 'Failed to grade quiz'
            });
        }
    }
} 