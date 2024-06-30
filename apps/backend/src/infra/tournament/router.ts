import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { tournamentContract } from '@tourni-nx/contract/tournament';
import { initServer } from '@ts-rest/express';
import {
  createTournament,
  deleteTournament,
  tournaments,
  updateTournament,
} from './tournament-infra';
import { join } from 'path';
import { LCodeSQSClient } from '@tourni-nx/aws';
import { env } from '../../utils/config';
import { randomUUID } from 'crypto';

const s = initServer();

export const tournamentRouter = s.router(tournamentContract, {
  ping: async () => {
    return {
      status: 200,
      body: {
        message: 'hello from tourni',
      },
    };
  },

  // mutations
  runCode: async ({ body: { code } }) => {
    try {
      /**
       function main(a: number, b: number) {
        // infinite loop
        let i = 0;
        function t() {
            console.log(i++);
            t();
        }
        t();
      }
       * 
       */
      // security issues // sanitize // run code in sandbox mode
      // case 1: input: 2, 3 output: 5
      // case 2: input: 15, 9 output: 24

      code += `
      const out1 = main(2, 3);
      const out2 = main(15, 9);
      console.log(out1);
      console.log(out2);
      `;

      /**
       * send message to the queue
       */
      const client = new LCodeSQSClient({
        accessKeyId: env.AWS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_KEY,
        region: env.AWS_REGION,
      });

      const eventId = randomUUID();

      await client.sendMessage({
        QueueUrl: env.PROCESS_QUEUE_URL,
        MessageBody: JSON.stringify({
          code,
          id: eventId,
        }),
      });

      return {
        status: 201,
        body: {
          isSuccess: true,
          data: {
            id: eventId,
          },
          message: 'code ran successfully',
        },
      };
    } catch (e) {
      if (e instanceof Error) {
        return {
          status: 500,
          body: {
            data: null,
            isSuccess: false,
            message: e.message,
            // details: e.details,
          },
        };
      } else {
        console.error('runCode error', e);
        return {
          status: 500,
          body: {
            data: null,
            isSuccess: false,
            message: 'Internal server error',
          },
        };
      }
    }
  },
  createTournament,
  updateTournament,
  deleteTournament,

  // queries
  tournaments,
});
