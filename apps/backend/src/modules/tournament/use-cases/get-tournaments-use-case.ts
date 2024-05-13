import { UseCase } from '../../user-case';
import { Tournament } from '../tournament-entity';
import { TournamentRepository } from '../tournament-repo';

export type GetTournamentsUseCaseRequest = unknown;
export interface GetTournamentsUseCaseResponse {
  data: Tournament[];
}

export class GetTournamentsUseCase
  implements
    UseCase<GetTournamentsUseCaseRequest, GetTournamentsUseCaseResponse>
{
  constructor(private repo: TournamentRepository) {}

  async execute(
    request: GetTournamentsUseCaseRequest
  ): Promise<GetTournamentsUseCaseResponse> {
    const tournaments = await this.repo.findAll({ skip: 1, limit: 10 });

    return {
      data: tournaments,
    };
  }
}
