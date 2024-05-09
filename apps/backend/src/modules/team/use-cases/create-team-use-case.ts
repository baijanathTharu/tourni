import { UseCase } from "../../user-case";
import { Team } from "../team-entity";
import { TeamRepository } from "../team-repo";

export interface CreateTeamUseCaseRequest extends Omit<Team, "id"> {}

export interface CreateTeamUseCaseResponse {
  team: Team;
}

export class CreateTeamUseCase
  implements UseCase<CreateTeamUseCaseRequest, CreateTeamUseCaseResponse>
{
  constructor(private repo: TeamRepository) {}

  async execute(
    request: CreateTeamUseCaseRequest
  ): Promise<CreateTeamUseCaseResponse> {
    const team = new Team(request);

    await this.repo.create(team);

    return {
      team,
    };
  }
}
