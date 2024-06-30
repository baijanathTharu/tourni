import { config } from 'dotenv';

config({
  path: '.env',
});

export const env = {
  AWS_REGION: process.env.AWS_REGION || '',
  AWS_KEY_ID: process.env.AWS_KEY_ID || '',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '',
  PROCESS_QUEUE_URL: process.env.PROCESS_QUEUE_URL || '',
  DONE_QUEUE_URL: process.env.DONE_QUEUE_URL || '',
} as const;
