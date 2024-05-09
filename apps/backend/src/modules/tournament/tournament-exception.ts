import { StatusCodes } from 'http-status-codes';

export class TournamentException extends Error {
  details?: Record<string, unknown>;

  status: StatusCodes;

  private constructor(
    message: string,
    status: StatusCodes,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.details = details;
    this.status = status;

    Error.captureStackTrace(this, TournamentException);
  }

  public static badRequest(
    details?: Record<string, unknown>
  ): TournamentException {
    return new TournamentException(
      'Bad request',
      StatusCodes.BAD_REQUEST,
      details
    );
  }

  public static unauthorized(
    details?: Record<string, unknown>
  ): TournamentException {
    return new TournamentException(
      'Unauthorized',
      StatusCodes.UNAUTHORIZED,
      details
    );
  }

  public static notFound(
    details?: Record<string, unknown>
  ): TournamentException {
    return new TournamentException(
      'Tournament not found',
      StatusCodes.NOT_FOUND,
      details
    );
  }

  public static alreadyExists(
    details?: Record<string, unknown>
  ): TournamentException {
    return new TournamentException(
      'Tournament already exists',
      StatusCodes.CONFLICT,
      details
    );
  }

  public static validationError(
    details?: Record<string, unknown>
  ): TournamentException {
    return new TournamentException(
      'Validation error',
      StatusCodes.BAD_REQUEST,
      details
    );
  }
}
