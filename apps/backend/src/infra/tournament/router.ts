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
      const fileName = 'two-sum.ts';
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
      writeFileSync(fileName, code);
      // test cases

      const codePath = join(process.cwd(), fileName);

      const buff = execSync(`tsx ${codePath}`);

      console.log(buff.toString());
      const outs = buff
        .toString()
        .split('\n')
        .filter(Boolean)
        .map((o) => +o);

      const casesResult = [outs[0] === 5, outs[1] === 24];

      return {
        status: 201,
        body: {
          isSuccess: true,
          data: casesResult,
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
