import { UseCase } from '../../user-case';
import { Tournament } from '../tournament-entity';
import { TournamentRepository } from '../tournament-repo';

export interface CreateTournamentUseCaseRequest {
  name: string;
  tournamentOn: string;
  createdBy: string;
}
export interface CreateTournamentUseCaseResponse {
  tournament: Tournament;
}

export class CreateTournamentUseCase
  implements
    UseCase<CreateTournamentUseCaseRequest, CreateTournamentUseCaseResponse>
{
  constructor(private repo: TournamentRepository) {}

  async execute(
    request: CreateTournamentUseCaseRequest
  ): Promise<CreateTournamentUseCaseResponse> {
    const tournament = new Tournament(request);

    await this.repo.create(tournament);

    return {
      tournament,
    };
  }
}
