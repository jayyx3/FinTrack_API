import { Router } from "express";
import {
  createRecord,
  deleteRecord,
  getRecordById,
  listRecords,
  updateRecord
} from "./records.controller";
import { requireAuth } from "../../middlewares/auth";
import { requirePermission } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";
import {
  createRecordSchema,
  listRecordsSchema,
  recordIdParamSchema,
  updateRecordSchema
} from "./records.schemas";

const recordsRouter = Router();

recordsRouter.use(requireAuth);

recordsRouter.get("/", requirePermission("records", "read"), validate(listRecordsSchema), listRecords);
recordsRouter.get("/:id", requirePermission("records", "read"), validate(recordIdParamSchema), getRecordById);
recordsRouter.post("/", requirePermission("records", "create"), validate(createRecordSchema), createRecord);
recordsRouter.patch("/:id", requirePermission("records", "update"), validate(updateRecordSchema), updateRecord);
recordsRouter.delete("/:id", requirePermission("records", "delete"), validate(recordIdParamSchema), deleteRecord);

export { recordsRouter };
