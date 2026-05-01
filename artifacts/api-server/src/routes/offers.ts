import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, offersTable } from "@workspace/db";
import { ListOffersResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/offers", async (_req, res): Promise<void> => {
  const offers = await db
    .select()
    .from(offersTable)
    .where(eq(offersTable.isActive, true))
    .orderBy(offersTable.createdAt);
  res.json(ListOffersResponse.parse(offers));
});

export default router;
