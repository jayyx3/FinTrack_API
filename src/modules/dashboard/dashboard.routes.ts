import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requirePermission } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";
import { dashboardQuerySchema } from "./dashboard.schemas";
import { getSummary, getTrends } from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.use(requirePermission("dashboard", "read"));

dashboardRouter.get("/summary", validate(dashboardQuerySchema), getSummary);
dashboardRouter.get("/trends", validate(dashboardQuerySchema), getTrends);

export { dashboardRouter };
