import { pgTable, text, serial, integer, numeric, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const paymentMethodEnum = pgEnum("payment_method", ["cash", "bkash", "rocket", "nagad", "sonali-bank", "islami-bank"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "shipped", "delivered", "cancelled"]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: integer("customer_id"),
  customerName: text("customer_name").notNull(),
  mobile: text("mobile").notNull(),
  address: text("address").notNull(),
  items: jsonb("items").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentNumber: text("payment_number"),
  notes: text("notes"),
  status: orderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, status: true, orderNumber: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
