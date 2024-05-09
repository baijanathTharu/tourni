import { UseCase } from "../../user-case";
import { Team } from "../team-entity";
import { TeamException } from "../team-exception";
import { TeamRepository } from "../team-repo";

export interface UpdateTeamUseCaseRequest {
  id: string;
  name?: string;
}

export interface UpdateTeamUseCaseResponse {
  team: Team;
}

export class UpdateTeamUseCase
  implements UseCase<UpdateTeamUseCaseRequest, UpdateTeamUseCaseResponse>
{
  constructor(private repo: TeamRepository) {}

  async execute(
    request: UpdateTeamUseCaseRequest
  ): Promise<UpdateTeamUseCaseResponse> {
    const team = await this.repo.findById(request.id);

    if (!team) {
      throw TeamException.notFound({
        message: "team not found",
        id: request.id,
      });
    }

    team.name = request.name || team.name;

    await this.repo.save(team);

    return {
      team,
    };
  }
}
