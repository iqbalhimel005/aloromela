import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, customersTable } from "@workspace/db";
import {
  RegisterCustomerBody,
  VerifyOtpBody,
  SendOtpBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/customers/send-otp", async (req, res): Promise<void> => {
  const parsed = SendOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { mobile } = parsed.data;

  const [customer] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.mobile, mobile));

  if (!customer) {
    res.status(404).json({ error: "এই মোবাইল নম্বরে কোনো গ্রাহক নেই" });
    return;
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await db
    .update(customersTable)
    .set({ otp })
    .where(eq(customersTable.mobile, mobile));

  req.log.info({ mobile }, "OTP sent (mock)");

  res.json({
    success: true,
    message: "OTP পাঠানো হয়েছে",
    otp,
  });
});

router.post("/customers/verify-otp", async (req, res): Promise<void> => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { mobile, otp } = parsed.data;

  const [customer] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.mobile, mobile));

  if (!customer) {
    res.status(404).json({ error: "গ্রাহক পাওয়া যায়নি" });
    return;
  }

  if (customer.otp !== otp) {
    res.status(400).json({ error: "OTP সঠিক নয়" });
    return;
  }

  const [updated] = await db
    .update(customersTable)
    .set({ isVerified: true, otp: null })
    .where(eq(customersTable.mobile, mobile))
    .returning();

  res.json({
    success: true,
    message: "যাচাইকরণ সফল হয়েছে",
    customerId: updated.id,
  });
});

router.post("/customers", async (req, res): Promise<void> => {
  const parsed = RegisterCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const existing = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.mobile, parsed.data.mobile));

  if (existing.length > 0) {
    await db
      .update(customersTable)
      .set({ ...parsed.data, otp })
      .where(eq(customersTable.mobile, parsed.data.mobile));

    res.status(201).json({
      ...existing[0],
      ...parsed.data,
      otp,
    });
    return;
  }

  const [customer] = await db
    .insert(customersTable)
    .values({ ...parsed.data, otp })
    .returning();

  req.log.info({ customerId: customer.id }, "Customer registered");

  res.status(201).json({ ...customer });
});

export default router;
