import { Router } from 'express';
import { matchIdParamSchema } from '../validation/matches.js';
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from '../validation/commentary.js';
import { db } from '../db/db.js';
import { commentary } from '../db/schema.js';
import { desc, eq } from 'drizzle-orm';

const MAX_LIMIT = 100;

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get('/', async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  const queryParsed = listCommentaryQuerySchema.safeParse(req.query);

  if (!paramsParsed.success) {
    return res.status(400).json({
      error: 'Invalid match ID.',
      details: paramsParsed.error.issues,
    });
  }

  if (!queryParsed.success) {
    return res.status(400).json({
      error: 'Invalid query parameters.',
      details: queryParsed.error.issues,
    });
  }

  const limit = Math.min(queryParsed.data.limit ?? MAX_LIMIT, MAX_LIMIT);

  try {
    const commentaryEvents = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, paramsParsed.data.id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    return res.status(200).json({ data: commentaryEvents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Failed to fetch commentary.',
      details: String(error),
    });
  }
});

commentaryRouter.post('/', async (req, res) => {
  // Validate match ID parameter
  const paramsParsed = matchIdParamSchema.safeParse(req.params);

  if (!paramsParsed.success) {
    return res.status(400).json({
      error: 'Invalid match ID.',
      details: paramsParsed.error.issues,
    });
  }

  // Validate request body
  const bodyParsed = createCommentarySchema.safeParse(req.body);

  if (!bodyParsed.success) {
    return res.status(400).json({
      error: 'Invalid payload.',
      details: bodyParsed.error.issues,
    });
  }

  try {
    const [event] = await db
      .insert(commentary)
      .values({
        matchId: paramsParsed.data.id,
        ...bodyParsed.data,
      })
      .returning();

      if(res.app.locals.broadcastCommentary){
        res.app.locals.broadcastCommentary(event.matchId, event)
      }

    res.status(201).json({ data: event });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Failed to create commentary.',
      details: JSON.stringify(e),
    });
  }
});