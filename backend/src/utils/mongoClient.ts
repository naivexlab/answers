import mongoose, { ConnectOptions, Document } from 'mongoose';
import { config } from '../config';
import logger from './logger';

class MongoClient {
    private static instance: MongoClient;
    private isConnected: boolean = false;

    private constructor() {}

    public static getInstance(): MongoClient {
        if (!MongoClient.instance) {
            MongoClient.instance = new MongoClient();
        }
        return MongoClient.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            logger.info('MongoDB is already connected');
            return;
        }

        try {
            const options: ConnectOptions = {
                // Remove deprecated options
            };
            await mongoose.connect(config.mongodb.uri, options);
            this.isConnected = true;
            logger.info('MongoDB connected successfully');
        } catch (error) {
            logger.error('MongoDB connection error:', { error: error });
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            logger.info('MongoDB disconnected successfully');
        } catch (error) {
            logger.error('MongoDB disconnection error:', { error: error });
            throw error;
        }
    }

    public getConnection(): mongoose.Connection {
        return mongoose.connection;
    }

    public async query<T>(
        model: mongoose.Model<T>,
        query: mongoose.FilterQuery<T>,
        options?: mongoose.QueryOptions
    ): Promise<T[]> {
        try {
            return await model.find(query, null, options);
        } catch (error) {
            logger.error('MongoDB query error:', { error: error });
            throw error;
        }
    }

    public async findOne<T>(
        model: mongoose.Model<T>,
        query: mongoose.FilterQuery<T>,
        options?: mongoose.QueryOptions
    ): Promise<T | null> {
        try {
            return await model.findOne(query, null, options);
        } catch (error) {
            logger.error('MongoDB findOne error:', { error: error });
            throw error;
        }
    }

    public async create<T extends Document>(
        model: mongoose.Model<T>,
        data: Partial<T>
    ): Promise<T> {
        try {
            const document = new model(data);
            return await document.save();
        } catch (error) {
            logger.error('MongoDB create error:', { error: error });
            throw error;
        }
    }
}

export default MongoClient.getInstance(); 