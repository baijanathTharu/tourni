import { StatusCodes } from "http-status-codes";

export class TeamException extends Error {
  details?: Record<string, unknown>;

  private constructor(
    message: string,
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.details = details;

    Error.captureStackTrace(this, TeamException);
  }

  public static badRequest(details?: Record<string, unknown>): TeamException {
    return new TeamException("Bad request", StatusCodes.BAD_REQUEST, details);
  }

  public static unauthorized(details?: Record<string, unknown>): TeamException {
    return new TeamException("Unauthorized", StatusCodes.UNAUTHORIZED, details);
  }

  public static notFound(details?: Record<string, unknown>): TeamException {
    return new TeamException("Team not found", StatusCodes.NOT_FOUND, details);
  }

  public static alreadyExists(
    details?: Record<string, unknown>
  ): TeamException {
    return new TeamException(
      "Team already exists",
      StatusCodes.CONFLICT,
      details
    );
  }
}
