import { Tournament } from "./tournament-entity";

type TFindAllOpts = {
  skip: number;
  limit: number;
};

export abstract class TournamentRepository {
  abstract create(tournament: Tournament): Promise<void>;
  abstract findById(id: string): Promise<Tournament | null>;
  abstract save(tournamet: Tournament): Promise<boolean>;
  abstract findAll(opts: TFindAllOpts): Promise<Tournament[]>;
  abstract delete(id: string): Promise<boolean>;
}
