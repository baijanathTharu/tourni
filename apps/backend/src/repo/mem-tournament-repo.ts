import { Tournament } from '../modules/tournament/tournament-entity';
import { TournamentRepository } from '../modules/tournament/tournament-repo';

let tournaments: Tournament[] = [];
export class MemoryTournamentRepositoryImplementation
  implements TournamentRepository
{
  async create(tournament: Tournament): Promise<void> {
    tournaments.push(tournament);
  }
  async findById(id: string): Promise<Tournament | null> {
    return tournaments.find((t) => t.id === id) || null;
  }
  async save(tournament: Tournament): Promise<boolean> {
    tournaments = tournaments.map((t) => {
      if (t.id === tournament.id) {
        return tournament;
      }
      return t;
    });
    return true;
  }
  async findAll(opts: { skip: number; limit: number }): Promise<Tournament[]> {
    return tournaments;
  }
  async delete(id: string): Promise<boolean> {
    tournaments = tournaments.filter((t) => t.id !== id);
    return true;
  }
}
