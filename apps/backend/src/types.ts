import { StatusCodes } from 'http-status-codes';

// export type HTTPStatusCode =

export function getStatusCode(statusCode: StatusCodes) {
  return statusCode.valueOf() as any;
}
