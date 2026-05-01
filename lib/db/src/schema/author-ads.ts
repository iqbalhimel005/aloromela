import { pgTable, text, serial, integer, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const authorAdStatusEnum = pgEnum("author_ad_status", ["pending", "approved", "rejected"]);

export const authorAdsTable = pgTable("author_ads", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  bookTitle: text("book_title").notNull(),
  bookDescription: text("book_description").notNull(),
  genre: text("genre").notNull(),
  publisherName: text("publisher_name"),
  publishYear: integer("publish_year"),
  price: numeric("price", { precision: 10, scale: 2 }),
  coverImage: text("cover_image"),
  status: authorAdStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAuthorAdSchema = createInsertSchema(authorAdsTable).omit({ id: true, createdAt: true, status: true });
export type InsertAuthorAd = z.infer<typeof insertAuthorAdSchema>;
export type AuthorAd = typeof authorAdsTable.$inferSelect;
