import { contract } from '@tourni-nx/contract/index';
import { initServer } from '@ts-rest/express';
import { tournamentRouter } from './tournament/router';

const s = initServer();

export const router = s.router(contract, {
  tournaments: tournamentRouter,
});
