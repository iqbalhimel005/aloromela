import { Router, type IRouter } from "express";
import healthRouter from "./health";
import booksRouter from "./books";
import customersRouter from "./customers";
import sellRequestsRouter from "./sell-requests";
import bookRequestsRouter from "./book-requests";
import authorAdsRouter from "./author-ads";
import offersRouter from "./offers";
import ordersRouter from "./orders";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(booksRouter);
router.use(customersRouter);
router.use(sellRequestsRouter);
router.use(bookRequestsRouter);
router.use(authorAdsRouter);
router.use(offersRouter);
router.use(ordersRouter);
router.use(adminRouter);

export default router;
