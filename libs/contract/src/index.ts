import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ZodSchema } from 'zod/lib';

extendZodWithOpenApi(z);

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
export type TTournamentSchema = z.infer<typeof TournamentSchema>;
const CreateTournamentBodySchema = TournamentSchema.pick({
  name: true,
  createdBy: true,
  tournamentOn: true,
});
export type TCreateTournamentBodySchema = z.infer<typeof TournamentSchema>;

function getSchema(schema?: ZodSchema) {
  return z.object({
    isSuccess: z.boolean(),
    data: schema || z.null(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  });
}

export const tournamentContract = c.router({
  ping: {
    method: 'GET',
    path: '/ping',
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  createTournament: {
    method: 'POST',
    path: '/v1/tournament/create',
    responses: {
      201: getSchema(TournamentSchema),
      400: getSchema(),
      500: getSchema(),
    },
    body: CreateTournamentBodySchema.openapi({
      title: 'Tournament',
      mediaExamples: {
        myExample: {
          value: {
            name: 'PubG',
            createdBy: 'Ram',
            tournamentOn: '2024-05-12T16:12:29.657Z',
          },
          summary: 'Example of a user',
        },
      },
    }),
    summary: 'Create a tournament',
    description: 'Create a tournament',
  },
});

export const contract = c.router({
  tournaments: tournamentContract,
});
