import { Tournament } from '../modules/tournament/tournament-entity';
import { TournamentRepository } from '../modules/tournament/tournament-repo';

export class MemoryTournamentRepositoryImplementation
  implements TournamentRepository
{
  tournaments: Tournament[] = [];
  async create(tournament: Tournament): Promise<void> {
    this.tournaments.push(tournament);
  }
  findById(id: string): Promise<Tournament | null> {
    throw new Error('Method not implemented.');
  }
  save(tournamet: Tournament): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async findAll(opts: { skip: number; limit: number }): Promise<Tournament[]> {
    return this.tournaments;
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
