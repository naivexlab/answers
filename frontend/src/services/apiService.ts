import axios, { AxiosRequestConfig } from 'axios';
import config from '../config';
import { errorManager } from '../components/SnackNotification';
import { Quiz, UserAnswers, EvaluationResponse } from '../models/models';

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
});

const handleError = (error: any, defaultMessage: string) => {
  const message = error.response?.data?.message || defaultMessage;
  errorManager.notify(message, 'error');
  throw new Error(message);
};


export const quizService = {
  generateQuiz: async (topic: string): Promise<Quiz | null> => {
    try {
      const config: AxiosRequestConfig = {
        timeout: 15000,
        params: { topic: encodeURIComponent(topic) }
      };
      
      const response = await axiosInstance.get('/generate', config);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.code === 'ECONNABORTED'
          ? 'Quiz generation timed out (15s)'
          : error.response?.data?.message || 'Network error';
        handleError(error, message);
      }
      handleError(error, 'Failed to generate quiz');
      return null;
    }
  },

  gradeQuiz: async (quizId: string, userAnswers: UserAnswers): Promise<EvaluationResponse | null> => {
    try {
      const config: AxiosRequestConfig = {
        timeout: 15000,
        params: { quizId }
      };
      
      const response = await axiosInstance.post('/grade', { answers: userAnswers }, config);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.code === 'ECONNABORTED'
          ? 'Quiz evaluation timed out (15s)'
          : error.response?.data?.message || 'Network error';
        handleError(error, message);
      }
      handleError(error, 'Failed to grade quiz');
      return null;
    }
  }
};