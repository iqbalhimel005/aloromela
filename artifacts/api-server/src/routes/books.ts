import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, booksTable } from "@workspace/db";
import {
  ListBooksQueryParams,
  GetBookParams,
  ListBooksResponse,
  GetBookResponse,
  GetFeaturedBooksResponse,
  GetBookStatsResponse,
} from "@workspace/api-zod";

function normalizeBook(book: Record<string, unknown>) {
  return {
    ...book,
    price: Number(book.price),
    discountedPrice: book.discountedPrice != null ? Number(book.discountedPrice) : undefined,
    rating: book.rating != null ? Number(book.rating) : undefined,
    description: book.description ?? undefined,
    descriptionBn: book.descriptionBn ?? undefined,
    previewText: book.previewText ?? undefined,
    previewTextBn: book.previewTextBn ?? undefined,
    isbn: book.isbn ?? undefined,
    edition: book.edition ?? undefined,
    reviewCount: book.reviewCount ?? undefined,
    publisher: book.publisher ?? undefined,
    publisherBn: book.publisherBn ?? undefined,
    pdfUrl: book.pdfUrl ?? undefined,
  };
}

const router: IRouter = Router();

router.get("/books/featured", async (_req, res): Promise<void> => {
  const books = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.isFeatured, true))
    .limit(8);
  res.json(GetFeaturedBooksResponse.parse(books.map(normalizeBook)));
});

router.get("/books/stats", async (_req, res): Promise<void> => {
  const allBooks = await db.select({ category: booksTable.category }).from(booksTable);

  const stats = {
    total: allBooks.length,
    school: allBooks.filter(b => (b.category as string).startsWith("school-")).length,
    college: allBooks.filter(b => (b.category as string).startsWith("college-")).length,
    degree: allBooks.filter(b => (b.category as string).startsWith("degree-")).length,
    honours: allBooks.filter(b => (b.category as string).startsWith("honours-")).length,
    job: allBooks.filter(b => b.category === "job").length,
    novel: allBooks.filter(b => b.category === "novel").length,
    storyPoem: allBooks.filter(b => b.category === "story-poem").length,
  };

  res.json(GetBookStatsResponse.parse(stats));
});

router.get("/books", async (req, res): Promise<void> => {
  const parsed = ListBooksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, search, page, limit } = parsed.data;
  const offset = ((page ?? 1) - 1) * (limit ?? 12);

  const conditions = [];
  if (category) {
    conditions.push(eq(booksTable.category, category));
  }
  if (search) {
    conditions.push(
      sql`(${booksTable.titleBn} ILIKE ${`%${search}%`} OR ${booksTable.authorBn} ILIKE ${`%${search}%`} OR ${booksTable.title} ILIKE ${`%${search}%`})`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [books, countResult] = await Promise.all([
    db
      .select()
      .from(booksTable)
      .where(whereClause)
      .limit(limit ?? 12)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(booksTable)
      .where(whereClause),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const totalPages = Math.ceil(total / (limit ?? 12));

  res.json(
    ListBooksResponse.parse({
      books: books.map(normalizeBook),
      total,
      page: page ?? 1,
      totalPages,
    })
  );
});

router.get("/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid book ID" });
    return;
  }

  const [book] = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.id, id));

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.json(GetBookResponse.parse(normalizeBook(book as Record<string, unknown>)));
});

export default router;
