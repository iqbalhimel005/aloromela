import { Router, type IRouter } from "express";
import { db, ordersTable, booksTable, paymentMethodEnum } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";

type PaymentMethodValue = (typeof paymentMethodEnum.enumValues)[number];

const router: IRouter = Router();

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { items, customerName, mobile, address, paymentMethod, paymentNumber, notes, customerId } = parsed.data;

  let totalAmount = 0;
  const enrichedItems = [];

  for (const item of items) {
    const [book] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, item.bookId));

    if (!book) {
      res.status(400).json({ error: `Book with id ${item.bookId} not found` });
      return;
    }

    const price = Number(book.discountedPrice ?? book.price);
    totalAmount += price * item.quantity;
    enrichedItems.push({
      bookId: book.id,
      bookTitle: book.titleBn || book.title,
      quantity: item.quantity,
      price,
    });
  }

  const orderNumber = `ALM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber,
      customerId: customerId ?? null,
      customerName,
      mobile,
      address,
      items: enrichedItems,
      totalAmount: totalAmount.toFixed(2),
      paymentMethod: paymentMethod as PaymentMethodValue,
      paymentNumber: paymentNumber ?? null,
      notes: notes ?? null,
    })
    .returning();

  req.log.info({ orderId: order.id, orderNumber }, "Order created");

  res.status(201).json({
    ...order,
    items: enrichedItems,
  });
});

export default router;
