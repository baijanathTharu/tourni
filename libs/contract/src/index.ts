import { initContract } from '@ts-rest/core';
import { tournamentContract } from './tournament';

const c = initContract();

export const contract = c.router({
  tournaments: tournamentContract,
});
