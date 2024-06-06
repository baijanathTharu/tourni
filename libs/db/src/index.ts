import { PrismaClient } from '@prisma/client';

export function db() {
  return new PrismaClient();
}
