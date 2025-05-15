import { Router } from 'express';
import { QuizController } from '../controllers/quizController';

const router = Router();

// Generate a new quiz
router.get('/generate', QuizController.generateQuiz);

// Grade a quiz
router.post('/grade', QuizController.gradeQuiz);

export default router; 