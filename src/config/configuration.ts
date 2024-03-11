import dotenv from 'dotenv';
import path from 'path';
import process from 'process';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default () => ({
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || '',
  JWT_SECRET: process.env.JWT_SECRET || 'jwtSecret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
});
