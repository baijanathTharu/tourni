import { CreateTournamentUseCase } from '../../modules/tournament/use-cases/create-tournament-use-case';
import { TournamentException } from '../../modules/tournament/tournament-exception';
import { MemoryTournamentRepositoryImplementation } from '../../repo/mem-tournament-repo';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { tournamentContract } from '@tourni-nx/contract/tournament';
import { getStatusCode } from '../../types';
import { TournamentMapper } from './tournament-mapper';
import { UpdateTournamentUseCase } from '../../modules/tournament/use-cases/update-tournament-use-case';
import { DeleteTournamentUseCase } from '../../modules/tournament/use-cases/delete-tournament-use-case';
import { GetTournamentsUseCase } from '../../modules/tournament/use-cases/get-tournaments-use-case';

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

    const response = TournamentMapper.toResponse(useCaseOutput.tournament);

    return {
      status: 201,
      body: {
        isSuccess: true,
        data: response,
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
      console.error('createTournament', e);
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

export const updateTournament: AppRouteImplementationOrOptions<
  typeof tournamentContract.updateTournament
> = async ({ req: { body, params } }) => {
  try {
    const useCase = new UpdateTournamentUseCase(
      new MemoryTournamentRepositoryImplementation()
    );
    const useCaseOutput = await useCase.execute({
      id: params.tournamentId,
      name: body.name,
      tournamentOn: body.tournamentOn,
    });

    const response = TournamentMapper.toResponse(useCaseOutput.tournament);

    return {
      status: 201,
      body: {
        isSuccess: true,
        data: response,
        message: 'Tournament updated successfully',
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
      console.error('updateTournament', e);
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

export const deleteTournament: AppRouteImplementationOrOptions<
  typeof tournamentContract.deleteTournament
> = async ({ req: { body, params } }) => {
  try {
    const useCase = new DeleteTournamentUseCase(
      new MemoryTournamentRepositoryImplementation()
    );
    const useCaseOutput = await useCase.execute({
      id: params.tournamentId,
      createdBy: body.createdBy,
    });

    const response = TournamentMapper.toResponse(useCaseOutput.tournament);

    return {
      status: 201,
      body: {
        isSuccess: true,
        data: response,
        message: 'Tournament deleted successfully',
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
      console.error('deleteTournament', e);
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

export const tournaments: AppRouteImplementationOrOptions<
  typeof tournamentContract.tournaments
> = async () => {
  try {
    const useCase = new GetTournamentsUseCase(
      new MemoryTournamentRepositoryImplementation()
    );
    const useCaseOutput = await useCase.execute({});

    const response = useCaseOutput.data.map((t) =>
      TournamentMapper.toResponse(t)
    );

    return {
      status: 200,
      body: {
        isSuccess: true,
        data: response,
        message: 'Tournaments found successfully',
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
      console.error('tournaments', e);
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
