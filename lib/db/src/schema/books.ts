import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const booksTable = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleBn: text("title_bn").notNull(),
  author: text("author").notNull(),
  authorBn: text("author_bn").notNull(),
  publisher: text("publisher"),
  publisherBn: text("publisher_bn"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  discountedPrice: numeric("discounted_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(),
  coverImage: text("cover_image").notNull(),
  description: text("description"),
  descriptionBn: text("description_bn"),
  previewText: text("preview_text"),
  previewTextBn: text("preview_text_bn"),
  isbn: text("isbn"),
  edition: text("edition"),
  stockCount: integer("stock_count").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookSchema = createInsertSchema(booksTable).omit({ id: true, createdAt: true });
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof booksTable.$inferSelect;
