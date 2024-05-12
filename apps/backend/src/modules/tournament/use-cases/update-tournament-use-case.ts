import { UseCase } from '../../user-case';
import { Tournament } from '../tournament-entity';
import { TournamentException } from '../tournament-exception';
import { TournamentRepository } from '../tournament-repo';

export interface UpdateTournamentUseCaseRequest {
  id: string;
  name?: string;
  tournamentOn?: string;
}

export interface UpdateTournamentUseCaseResponse {
  tournament: Tournament;
}

export class UpdateTournamentUseCase
  implements
    UseCase<UpdateTournamentUseCaseRequest, UpdateTournamentUseCaseResponse>
{
  constructor(private repo: TournamentRepository) {}

  async execute(
    request: UpdateTournamentUseCaseRequest
  ): Promise<UpdateTournamentUseCaseResponse> {
    const tournament = await this.repo.findById(request.id);

    if (!tournament) {
      throw TournamentException.notFound({
        name: request.name,
        message: 'tournament not found',
        id: request.id,
      });
    }

    tournament.name = request.name || tournament.name;
    tournament.tournamentOn = request.tournamentOn
      ? request.tournamentOn
      : tournament.tournamentOn;

    await this.repo.save(tournament);

    return {
      tournament,
    };
  }
}
