import { z } from 'zod';

export const BASE_SCHEMA = z.object({
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  isSuccess: z.boolean(),
});

export function getErrorSchema() {
  return BASE_SCHEMA.extend({
    data: z.null(),
  });
}
