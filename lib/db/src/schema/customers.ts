import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull().unique(),
  district: text("district").notNull(),
  upazila: text("upazila").notNull(),
  postOffice: text("post_office"),
  village: text("village"),
  isVerified: boolean("is_verified").notNull().default(false),
  otp: text("otp"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true, otp: true, isVerified: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
