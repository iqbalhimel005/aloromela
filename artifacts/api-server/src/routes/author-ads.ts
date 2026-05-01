import { Router, type IRouter } from "express";
import { db, authorAdsTable, insertAuthorAdSchema } from "@workspace/db";
import {
  CreateAuthorAdBody,
  ListAuthorAdsResponse,
} from "@workspace/api-zod";

function normalizeAuthorAd(a: Record<string, unknown>) {
  return {
    ...a,
    price: a.price != null ? Number(a.price) : undefined,
    email: a.email ?? undefined,
    publisherName: a.publisherName ?? undefined,
    publishYear: a.publishYear != null ? Number(a.publishYear) : undefined,
    coverImage: a.coverImage ?? undefined,
  };
}

const router: IRouter = Router();

router.get("/author-ads", async (_req, res): Promise<void> => {
  const ads = await db
    .select()
    .from(authorAdsTable)
    .orderBy(authorAdsTable.createdAt);
  res.json(ListAuthorAdsResponse.parse(ads.map(normalizeAuthorAd)));
});

router.post("/author-ads", async (req, res): Promise<void> => {
  const parsed = CreateAuthorAdBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const insertData = insertAuthorAdSchema.parse({
    ...parsed.data,
    price: parsed.data.price != null ? String(parsed.data.price) : undefined,
  });

  const [ad] = await db
    .insert(authorAdsTable)
    .values(insertData)
    .returning();

  req.log.info({ id: ad.id }, "Author ad created");

  res.status(201).json(ad);
});

export default router;
