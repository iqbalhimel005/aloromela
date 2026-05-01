import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const offersTable = pgTable("offers", {
  id: serial("id").primaryKey(),
  titleBn: text("title_bn").notNull(),
  descriptionBn: text("description_bn").notNull(),
  discountPercent: integer("discount_percent").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  badgeText: text("badge_text"),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOfferSchema = createInsertSchema(offersTable).omit({ id: true, createdAt: true });
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offersTable.$inferSelect;
