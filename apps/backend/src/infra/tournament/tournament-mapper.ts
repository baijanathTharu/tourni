import { TTournamentSchema } from '@tourni-nx/contract';
import { Tournament } from '../../modules/tournament/tournament-entity';

export class TournamentMapper {
  public static toResponse(tournament: Tournament): TTournamentSchema {
    return {
      name: tournament.name,
      createdBy: tournament.createdBy,
      tournamentOn: tournament.tournamentOn,
    };
  }

  /*
  public static toDomain(input: TCreateTournamentBodySchema): Tournament {
    return new Tournament({
      name: input.name,
      createdBy: input.createdBy,
      tournamentOn: input.tournamentOn,
    });
  }
  */
}
