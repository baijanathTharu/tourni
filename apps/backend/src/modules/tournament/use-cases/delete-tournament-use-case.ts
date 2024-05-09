import { UseCase } from "../../user-case";
import { Tournament } from "../tournament-entity";
import { TournamentException } from "../tournament-exception";
import { TournamentRepository } from "../tournament-repo";

export interface DeleteTournamentUseCaseRequest {
  id: string;
  createdBy: string;
}

export interface DeleteTournamentUseCaseResponse {
  tournament: Tournament;
}

export class DeleteTournamentUseCase
  implements
    UseCase<DeleteTournamentUseCaseRequest, DeleteTournamentUseCaseResponse>
{
  constructor(private repo: TournamentRepository) {}

  async execute(
    request: DeleteTournamentUseCaseRequest
  ): Promise<DeleteTournamentUseCaseResponse> {
    const tournament = await this.repo.findById(request.id);

    if (!tournament) {
      throw TournamentException.notFound({
        message: "tournament not found",
        id: request.id,
      });
    }

    if (tournament.createdBy !== request.createdBy) {
      throw TournamentException.unauthorized({
        message: "you are not allowed to delete this tournament",
        id: request.id,
      });
    }

    await this.repo.delete(request.id);

    return {
      tournament,
    };
  }
}
