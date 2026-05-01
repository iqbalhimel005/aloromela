import { pgTable, text, serial, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookConditionEnum = pgEnum("book_condition", ["new", "good", "fair"]);
export const sellRequestStatusEnum = pgEnum("sell_request_status", ["pending", "reviewed", "accepted", "rejected"]);

export const sellRequestsTable = pgTable("sell_requests", {
  id: serial("id").primaryKey(),
  sellerName: text("seller_name").notNull(),
  mobile: text("mobile").notNull(),
  bookTitle: text("book_title").notNull(),
  bookAuthor: text("book_author"),
  category: text("category").notNull(),
  condition: bookConditionEnum("condition").notNull(),
  askingPrice: numeric("asking_price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  status: sellRequestStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSellRequestSchema = createInsertSchema(sellRequestsTable).omit({ id: true, createdAt: true, status: true });
export type InsertSellRequest = z.infer<typeof insertSellRequestSchema>;
export type SellRequest = typeof sellRequestsTable.$inferSelect;
