import { config } from './config';
import mongoClient from './utils/mongoClient';
import logger from './utils/logger';
import app from './app'
import http from 'http';


const server = http.createServer(app);

async function startServer() {
    try {
        console.log("server init")
        // init
        await mongoClient.connect();
        
        server.listen(config.port, () => {
            logger.info(`Server listening on port ${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', { error: error });
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    await mongoClient.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    await mongoClient.disconnect();
    process.exit(0);
});

startServer();
