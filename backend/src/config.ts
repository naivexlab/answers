import * as dotenv from "dotenv";
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
    port: parseInt(process.env.PORT ?? '4000', 10),
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/answers',
    },
    llmService: {
        baseUrl: process.env.LLM_SERVICE_URL || 'http://localhost:5000',
        models: {
            gemini: 'gemini',
            claude: 'claude'
        }
    },
    cors: {
        origin: process.env.NODE_ENV === 'development' ? '*' : process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
} as const;

export type Config = typeof config; 