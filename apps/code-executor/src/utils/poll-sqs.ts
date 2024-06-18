import { LCodeSQSClient } from '@tourni-nx/aws';
import { env } from './config';

const client = new LCodeSQSClient({
  accessKeyId: env.AWS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION,
});

interface IMessage {
  code: string;
  id: string;
  receiptHandle: string;
}

async function processMessage(message: IMessage) {
  console.log(`Processing message: ${message.id}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await client.deleteMessage({
    QueueUrl: env.PROCESS_QUEUE_URL,
    ReceiptHandle: message.receiptHandle,
  });
}

export async function pollMessages() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await client.receiveMessage({
        QueueUrl: env.PROCESS_QUEUE_URL,
      });

      if (result.Messages && result.Messages.length > 0) {
        await Promise.all(
          result.Messages.map((message) => {
            console.log('need to process the message:', message);
          })
        );
      }
    } catch (error) {
      console.error('Error processing messages', error);
    }
  }
}
