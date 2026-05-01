import { pgTable, text, serial, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookRequestStatusEnum = pgEnum("book_request_status", ["pending", "found", "unavailable"]);

export const bookRequestsTable = pgTable("book_requests", {
  id: serial("id").primaryKey(),
  requesterName: text("requester_name").notNull(),
  mobile: text("mobile").notNull(),
  bookTitle: text("book_title").notNull(),
  bookAuthor: text("book_author"),
  category: text("category"),
  notes: text("notes"),
  status: bookRequestStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookRequestSchema = createInsertSchema(bookRequestsTable).omit({ id: true, createdAt: true, status: true });
export type InsertBookRequest = z.infer<typeof insertBookRequestSchema>;
export type BookRequest = typeof bookRequestsTable.$inferSelect;
