import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  integer,
  timestamp,
  jsonb,
  text,
  foreignKey,
} from 'drizzle-orm/pg-core';

// Enum for match status
export const matchStatus = pgEnum('match_status', [
  'scheduled',
  'live',
  'finished',
]);

// Matches table
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: varchar('sport', { length: 50 }).notNull(),
  homeTeam: varchar('home_team', { length: 100 }).notNull(),
  awayTeam: varchar('away_team', { length: 100 }).notNull(),
  status: matchStatus('status').notNull().default('scheduled'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').notNull().default(0),
  awayScore: integer('away_score').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Commentary table
export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .notNull()
    .references(() => matches.id),
  minute: integer('minute'),
  sequence: integer('sequence'),
  period: varchar('period', { length: 50 }),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  actor: varchar('actor', { length: 100 }),
  team: varchar('team', { length: 100 }),
  message: text('message'),
  metadata: jsonb('metadata'),
  tags: text('tags'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
