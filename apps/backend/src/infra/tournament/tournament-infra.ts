import { CreateTournamentUseCase } from '../../modules/tournament/use-cases/create-tournament-use-case';
import { TournamentException } from '../../modules/tournament/tournament-exception';
import { MemoryTournamentRepositoryImplementation } from '../../repo/mem-tournament-repo';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { tournamentContract } from '@tourni-nx/contract';
import { getStatusCode } from '../../types';

export const createTournament: AppRouteImplementationOrOptions<
  typeof tournamentContract.createTournament
> = async ({ req: { body } }) => {
  try {
    const useCase = new CreateTournamentUseCase(
      new MemoryTournamentRepositoryImplementation()
    );
    const useCaseOutput = await useCase.execute({
      name: body.name,
      createdBy: body.createdBy,
      tournamentOn: body.tournamentOn,
    });
    console.log({
      name: useCaseOutput.tournament.name,
      tournamentOn: useCaseOutput.tournament.tournamentOn,
      createdBy: useCaseOutput.tournament.name,
    });

    return {
      status: 201,
      body: {
        isSuccess: true,
        data: {
          name: useCaseOutput.tournament.name,
          createdBy: useCaseOutput.tournament.createdBy,
          tournamentOn: useCaseOutput.tournament.tournamentOn,
        },
        message: 'Tournament created successfully',
      },
    };
  } catch (e) {
    if (e instanceof TournamentException) {
      return {
        status: getStatusCode(e.status),
        body: {
          data: null,
          isSuccess: false,
          message: e.message,
          details: e.details,
        },
      };
    } else {
      console.error('create tournament error', e);
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
};