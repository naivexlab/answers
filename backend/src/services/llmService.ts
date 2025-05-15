import axios from 'axios';
import { config } from '../config';
import logger from '../utils/logger';

interface LLMRequest {
    text: string;
    model: string;
}

export class LLMService {
    private static instance: LLMService;
    private readonly baseUrl: string;

    private constructor() {
        this.baseUrl = config.llmService.baseUrl;
    }

    public static getInstance(): LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }

    private createQuizPrompt(topic: string): string {
        return `Generate a 5-question multiple-choice quiz about "${topic}". 
        Each question should have 4 options (A, B, C, D) and one correct answer.
        Return the response in the following JSON format:
        {
            "questions": [
                {
                    "id": 1,
                    "text": "Question text here",
                    "options": {
                        "A": "Option A text",
                        "B": "Option B text",
                        "C": "Option C text",
                        "D": "Option D text"
                    },
                    "answer": "A"
                },
                // ... more questions
            ]
        }
        
        Make sure:
        1. Each question has a unique id (1-5)
        2. Questions are challenging but fair
        3. Options are clear and unambiguous
        4. The answer is one of: A, B, C, or D
        5. The response is valid JSON
        6. Questions are relevant to the topic
        7. Include a mix of difficulty levels`;
    }

    public async generateQuiz(topic: string, model: 'gemini' | 'claude' = 'gemini'): Promise<any> {
        try {
            const prompt = this.createQuizPrompt(topic);
            const response = await axios.post<LLMRequest>(`${this.baseUrl}/api/llm`, {
                prompt,
                model
            });

            // Parse the response text as JSON
            let quizData;
            try {
                const cleanedString = response.data.text?.replace(/^```json|```$/g, '')?.trim();
                if (!cleanedString) return null;

                quizData = JSON.parse(cleanedString);
            } catch (parseError) {
                logger.error('Error parsing LLM response as JSON:', parseError);
                throw new Error('Invalid JSON response from LLM service');
            }

            // Validate the quiz data structure
            if (!this.validateQuizData(quizData)) {
                throw new Error('Invalid quiz data structure from LLM service');
            }

            return quizData;
        } catch (error) {
            logger.error('Error generating quiz:', { error: error });
            return null;
        }
    }

    private validateQuizData(data: any): boolean {
        if (!data || !Array.isArray(data.questions) || data.questions.length !== 5) {
            return false;
        }

        return data.questions.every((q: any) => {
            return (
                typeof q.id === 'number' &&
                typeof q.text === 'string' &&
                q.options &&
                typeof q.options.A === 'string' &&
                typeof q.options.B === 'string' &&
                typeof q.options.C === 'string' &&
                typeof q.options.D === 'string' &&
                ['A', 'B', 'C', 'D'].includes(q.answer)
            );
        });
    }
}

export default LLMService.getInstance(); 