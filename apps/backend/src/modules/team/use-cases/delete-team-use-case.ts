import { UseCase } from "../../user-case";
import { Team } from "../team-entity";
import { TeamException } from "../team-exception";
import { TeamRepository } from "../team-repo";

export interface DeleteTeamUseCaseRequest {
  id: string;
  createdBy: string;
}

export interface DeleteTeamUseCaseResponse {
  team: Team;
}

export class DeleteTeamUseCase
  implements UseCase<DeleteTeamUseCaseRequest, DeleteTeamUseCaseResponse>
{
  constructor(private repo: TeamRepository) {}

  async execute(
    request: DeleteTeamUseCaseRequest
  ): Promise<DeleteTeamUseCaseResponse> {
    const team = await this.repo.findById(request.id);

    if (!team) {
      throw TeamException.notFound({
        message: "team not found",
        id: request.id,
      });
    }

    if (team.createdBy !== request.createdBy) {
      throw TeamException.unauthorized({
        message: "you are not allowed to delete this team",
        id: request.id,
      });
    }

    await this.repo.delete(team.id);

    return {
      team,
    };
  }
}
