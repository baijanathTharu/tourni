import { UseCase } from "../../user-case";
import { TeamException } from "../team-exception";
import { TeamRepository } from "../team-repo";

export interface RemoveMemberUseCaseRequest {
  teamId: string;
  memberIds: string[];
}

export interface RemoveMemberUseCaseResponse {
  members: string[];
}

export class RemoveMemberUseCase
  implements UseCase<RemoveMemberUseCaseRequest, RemoveMemberUseCaseResponse>
{
  constructor(private repo: TeamRepository) {}

  async execute(
    request: RemoveMemberUseCaseRequest
  ): Promise<RemoveMemberUseCaseResponse> {
    const team = await this.repo.findById(request.teamId);

    if (!team) {
      throw TeamException.notFound({
        message: "team not found",
        id: request.teamId,
      });
    }

    const members = await this.repo.getTeamMembers(request.teamId);

    const memberIds = request.memberIds.filter((memberId) => {
      return !members.includes(memberId);
    });

    await this.repo.removeMembers(request.teamId, memberIds);

    const newMembers = await this.repo.getTeamMembers(request.teamId);

    return {
      members: newMembers,
    };
  }
}
