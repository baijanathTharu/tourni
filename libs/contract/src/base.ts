import { ZodSchema, z } from 'zod';

export function getSchema(schema?: ZodSchema) {
  return z.object({
    isSuccess: z.boolean(),
    data: schema || z.null(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  });
}
