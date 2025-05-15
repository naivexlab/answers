import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
    id: number;
    text: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    answer: 'A' | 'B' | 'C' | 'D';
}

export interface IQuiz extends Document {
    quizId: string;
    topic: string;
    questions: IQuestion[];
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true }
    },
    answer: { 
        type: String, 
        required: true,
        enum: ['A', 'B', 'C', 'D']
    }
});

const QuizSchema = new Schema<IQuiz>(
    {
        quizId: { 
            type: String, 
            required: true, 
            unique: true,
        },
        topic: { 
            type: String, 
            required: true,
        },
        questions: [QuestionSchema]
    },
    {
        autoIndex: process.env.NODE_ENV === 'development',
        timestamps: true,
        bufferCommands: false,
        optimisticConcurrency: false // conflicts unlikely
    }
);

// Create indexes
QuizSchema.index({ quizId: 1 }, { unique: true });
QuizSchema.index({ createdAt: -1 });

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);