import { createWriteStream } from 'fs';
import path from 'path';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  [key: string]: any;
}

const logStream = createWriteStream(path.join(__dirname, 'logfile.log'), { flags: 'a' });

const logger = {
  log: (level: string, message: string, metadata: any = {}): void => {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...metadata
    };
    logStream.write(JSON.stringify(logEntry) + '\n');
    console.log(logEntry);
  },

  warn: (message: string, meta?: any): void => logger.log('warn', message, meta),
  info: (message: string, meta?: any): void => logger.log('info', message, meta),
  error: (message: string, meta?: any): void => logger.log('error', message, meta),
};

export default logger;