import { Server } from 'socket.io';
import { LCodeSQSClient } from '@tourni-nx/aws';
import { env } from './config';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { IOClient } from './socket';

const client = new LCodeSQSClient({
  accessKeyId: env.AWS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION,
});

type TDoneMessage = {
  id: string;
  data: {
    output: string[];
  };
};

/**
 * send the done output to the frontend client via websocket
 */
async function processDoneMessages(
  io: IOClient,
  {
    message,
    handle,
  }: {
    message: TDoneMessage;
    handle: string;
  }
) {
  console.log('Process the done message', message);

  io.emit(`practice_problem_response_${message.id}`, message);

  await client.deleteMessage({
    ReceiptHandle: handle,
    QueueUrl: env.DONE_QUEUE_URL,
  });
  console.log('Processed the done message', message);
}

export async function pollMessages(io: IOClient) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await client.receiveMessage({
        QueueUrl: env.DONE_QUEUE_URL,
      });

      if (result.Messages && result.Messages.length > 0) {
        await Promise.all(
          result.Messages.map((message) => {
            if (message.Body && message.ReceiptHandle) {
              const doneMessage = JSON.parse(message.Body) as TDoneMessage;
              processDoneMessages(io, {
                message: doneMessage,
                handle: message.ReceiptHandle,
              });
            }
          })
        );
      }
    } catch (error) {
      console.error('Error processing messages', error);
    }
  }
}
