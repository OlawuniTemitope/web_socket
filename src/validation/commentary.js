import { z } from 'zod';

// List commentary query schema
export const listCommentaryQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// Create commentary schema
export const createCommentarySchema = z.object({
  minute: z.coerce.number().int().nonnegative('Minute must be a non-negative integer'),
  sequence: z.coerce.number().int().nonnegative().optional(),
  period: z.string().min(1, 'Period cannot be empty'),
  eventType: z.string().min(1, 'Event type cannot be empty'),
  actor: z.string().optional(),
  team: z.string().optional(),
  message: z.string().min(1, 'Message cannot be empty'),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});
