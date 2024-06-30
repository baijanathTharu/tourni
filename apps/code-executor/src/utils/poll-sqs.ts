import { writeFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { LCodeSQSClient } from '@tourni-nx/aws';
import { env } from './config';
import { join } from 'path';

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

  const fileName = `${message.id}.ts`;
  // process the message
  writeFileSync(fileName, message.code);

  /**
   * copy the file into the container
   */
  const filePath = join(process.cwd(), fileName);
  execSync(`docker cp ${filePath} lcode-node-1:/app/${fileName}`);

  /**
   * exec the code file
   */
  try {
    const buff = execSync(`docker exec lcode-node-1 bash -c 'tsx ${fileName}'`);

    console.log('output from container', buff.toString());

    //TODO: compare the test cases with the output file for each problem
    const outs = buff
      .toString()
      .split('\n')
      .filter(Boolean)
      .map((o) => +o);

    const casesResult = [outs[0] === 5, outs[1] === 24];
    // send the event to the SQS
    await client.sendMessage({
      MessageBody: JSON.stringify({
        id: message.id,
        data: {
          output: casesResult,
        },
      }),
      QueueUrl: env.DONE_QUEUE_URL,
    });
  } catch (error) {
    console.log('Error executing file', error);
  }

  if (filePath) {
    unlinkSync(filePath);
  }

  await client.deleteMessage({
    QueueUrl: env.PROCESS_QUEUE_URL,
    ReceiptHandle: message.receiptHandle,
  });
  console.log('deleted', message.id);
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
            if (message.Body && message.ReceiptHandle) {
              const code = JSON.parse(message.Body) as {
                id: string;
                code: string;
              };
              if ('id' in code) {
                processMessage({
                  id: code.id,
                  code: code.code,
                  receiptHandle: message.ReceiptHandle,
                });
              }
            }
          })
        );
      }
    } catch (error) {
      console.error('Error processing messages', error);
    }
  }
}
