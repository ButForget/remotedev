import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const computers = pgTable("computers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  ip: varchar({ length: 255 }).notNull(),
});