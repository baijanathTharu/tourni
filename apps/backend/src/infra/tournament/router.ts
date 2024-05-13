import { tournamentContract } from '@tourni-nx/contract/tournament';
import { initServer } from '@ts-rest/express';
import {
  createTournament,
  deleteTournament,
  updateTournament,
} from './tournament-infra';

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
  createTournament,
  updateTournament,
  deleteTournament,
});
