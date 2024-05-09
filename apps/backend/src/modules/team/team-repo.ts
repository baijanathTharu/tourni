import { Team } from "./team-entity";

type TFindAllOpts = {
  skip: number;
  limit: number;
};

export abstract class TeamRepository {
  abstract create(team: Team): Promise<void>;
  abstract findById(id: string): Promise<Team | null>;
  abstract save(team: Team): Promise<boolean>;
  abstract findAll(opts: TFindAllOpts): Promise<Team[]>;
  abstract delete(id: string): Promise<boolean>;
  abstract addMembers(teamId: string, memberIds: string[]): Promise<boolean>;
  abstract removeMembers(teamId: string, memberIds: string[]): Promise<boolean>;
  abstract getTeamMembers(teamId: string): Promise<string[]>;
}
