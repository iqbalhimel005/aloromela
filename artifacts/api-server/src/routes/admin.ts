import { Router, type IRouter } from "express";
import { db, ordersTable, customersTable, booksTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const ADMIN_USERNAME = "iqbal.himel";
const ADMIN_PASSWORD = "414144635h";
const ADMIN_TOKEN = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;

const router: IRouter = Router();

function checkAuth(req: any, res: any): boolean {
  const auth = req.headers["x-admin-password"];
  if (auth !== ADMIN_TOKEN) {
    res.status(401).json({ error: "অননুমোদিত অ্যাক্সেস" });
    return false;
  }
  return true;
}

router.post("/admin/login", (req, res): void => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "ব্যবহারকারীর নাম বা পাসওয়ার্ড সঠিক নয়" });
  }
});

router.get("/admin/orders", async (req, res): Promise<void> => {
  if (!checkAuth(req, res)) return;
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  res.json(orders);
});

router.patch("/admin/orders/:id/status", async (req, res): Promise<void> => {
  if (!checkAuth(req, res)) return;
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "অবৈধ স্ট্যাটাস" });
    return;
  }
  const [updated] = await db
    .update(ordersTable)
    .set({ status })
    .where(eq(ordersTable.id, Number(id)))
    .returning();
  res.json(updated);
});

router.get("/admin/customers", async (req, res): Promise<void> => {
  if (!checkAuth(req, res)) return;
  const customers = await db.select().from(customersTable).orderBy(desc(customersTable.createdAt));
  res.json(customers);
});

router.get("/admin/stats", async (req, res): Promise<void> => {
  if (!checkAuth(req, res)) return;
  const orders = await db.select().from(ordersTable);
  const customers = await db.select().from(customersTable);
  const books = await db.select().from(booksTable);
  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  res.json({
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalBooks: books.length,
    totalRevenue: totalRevenue.toFixed(2),
    pendingOrders: orders.filter(o => o.status === "pending").length,
  });
});

export default router;
