import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { BASE_SCHEMA, getErrorSchema } from './base';

extendZodWithOpenApi(z);

const c = initContract();

const TournamentSchema = z.object({
  id: z.string().uuid(),
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
export const CreateTournamentBodySchema = TournamentSchema.pick({
  name: true,
  createdBy: true,
  tournamentOn: true,
});
export type TCreateTournamentBodySchema = z.infer<typeof TournamentSchema>;

const UpdateTournamentBodySchema = TournamentSchema.pick({
  name: true,
  tournamentOn: true,
});
export type TUpdateTournamentBodySchema = z.infer<
  typeof UpdateTournamentBodySchema
>;

const DeleteTournamentBodySchema = TournamentSchema.pick({
  createdBy: true,
});
export type TDeleteTournamentBodySchema = z.infer<
  typeof DeleteTournamentBodySchema
>;

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
      201: BASE_SCHEMA.extend({
        data: TournamentSchema,
      }),
      400: getErrorSchema(),
      500: getErrorSchema(),
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
          summary: 'Example of a tournament',
        },
      },
    }),
    summary: 'Create a tournament',
    description: 'Create a tournament',
  },
  updateTournament: {
    method: 'POST',
    path: '/v1/tournament/update/:tournamentId',
    responses: {
      201: BASE_SCHEMA.extend({ data: TournamentSchema }),
      400: getErrorSchema(),
      500: getErrorSchema(),
    },
    body: UpdateTournamentBodySchema.openapi({
      title: 'Tournament',
      mediaExamples: {
        myExample: {
          value: {
            name: 'PubG',
            tournamentOn: '2024-05-12T16:12:29.657Z',
          },
          summary: 'Example of a tournament',
        },
      },
    }),
    summary: 'Update a tournament',
    description: 'Update a tournament',
  },
  deleteTournament: {
    method: 'POST',
    path: '/v1/tournament/delete/:tournamentId',
    responses: {
      201: BASE_SCHEMA.extend({ data: TournamentSchema }),
      400: getErrorSchema(),
      500: getErrorSchema(),
    },
    body: DeleteTournamentBodySchema.openapi({
      title: 'Tournament',
      mediaExamples: {
        myExample: {
          value: {
            createdBy: 'Ram',
            id: 'fnakjfkhy16371',
          },
          summary: 'Example of a tournament',
        },
      },
    }),
    summary: 'Delete a tournament',
    description: 'delete your tournament',
  },
  tournaments: {
    method: 'GET',
    path: '/v1/tournaments',
    responses: {
      200: BASE_SCHEMA.extend({
        data: z.array(TournamentSchema),
      }),
      400: getErrorSchema(),
      500: getErrorSchema(),
    },
    summary: 'Get all tournaments',
    description: 'Get all tournaments',
  },
});
