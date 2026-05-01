import { Router, type IRouter } from "express";
import { db, bookRequestsTable } from "@workspace/db";
import {
  CreateBookRequestBody,
  ListBookRequestsResponse,
} from "@workspace/api-zod";

function normalizeBookRequest(r: Record<string, unknown>) {
  return {
    ...r,
    bookAuthor: r.bookAuthor ?? undefined,
    category: r.category ?? undefined,
    notes: r.notes ?? undefined,
  };
}

const router: IRouter = Router();

router.get("/book-requests", async (_req, res): Promise<void> => {
  const requests = await db
    .select()
    .from(bookRequestsTable)
    .orderBy(bookRequestsTable.createdAt);
  res.json(ListBookRequestsResponse.parse(requests.map(normalizeBookRequest)));
});

router.post("/book-requests", async (req, res): Promise<void> => {
  const parsed = CreateBookRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [request] = await db
    .insert(bookRequestsTable)
    .values(parsed.data)
    .returning();

  req.log.info({ id: request.id }, "Book request created");

  res.status(201).json(request);
});

export default router;
