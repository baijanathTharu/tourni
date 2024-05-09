import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const TournamentSchema = z.object({
  name: z
    .string({
      message: 'name must be a string',
    })
    .min(3, {
      message: 'name must be at least 3 characters long',
    })
    .max(100, {
      message: 'name must be at most 100 characters long',
    }),
  tournamentOn: z.string({
    message: 'tournamentOn must be a date',
  }),
  createdBy: z
    .string({
      message: 'createdBy must be a string',
    })
    .min(3, {
      message: 'createdBy must be at least 3 characters long',
    })
    .max(100, {
      message: 'createdBy must be at most 100 characters long',
    }),
});

export const contract = c.router({
  createTournament: {
    method: 'POST',
    path: '/v1/tournament/create',
    responses: {
      201: z.object({
        isSuccess: z.boolean(),
        data: TournamentSchema,
        message: z.string(),
        details: z.record(z.unknown()).optional(),
      }),
      400: z.object({
        isSuccess: z.boolean(),
        data: z.null(),
        message: z.string(),
        details: z.record(z.unknown()).optional(),
      }),
      500: z.object({
        isSuccess: z.boolean(),
        data: z.null(),
        message: z.string(),
        details: z.record(z.unknown()).optional(),
      }),
    },
    body: TournamentSchema.pick({
      name: true,
      createdBy: true,
      tournamentOn: true,
    }),
    summary: 'Create a tournament',
    description: 'Create a tournament',
  },
});
