import { Router, type IRouter } from "express";
import { db, sellRequestsTable, insertSellRequestSchema } from "@workspace/db";
import {
  CreateSellRequestBody,
  ListSellRequestsResponse,
} from "@workspace/api-zod";

function normalizeSellRequest(r: Record<string, unknown>) {
  return {
    ...r,
    askingPrice: Number(r.askingPrice),
    bookAuthor: r.bookAuthor ?? undefined,
    description: r.description ?? undefined,
  };
}

const router: IRouter = Router();

router.get("/sell-requests", async (_req, res): Promise<void> => {
  const requests = await db
    .select()
    .from(sellRequestsTable)
    .orderBy(sellRequestsTable.createdAt);
  res.json(ListSellRequestsResponse.parse(requests.map(normalizeSellRequest)));
});

router.post("/sell-requests", async (req, res): Promise<void> => {
  const parsed = CreateSellRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const insertData = insertSellRequestSchema.parse({
    ...parsed.data,
    askingPrice: String(parsed.data.askingPrice),
  });

  const [request] = await db
    .insert(sellRequestsTable)
    .values(insertData)
    .returning();

  req.log.info({ id: request.id }, "Sell request created");

  res.status(201).json(request);
});

export default router;
