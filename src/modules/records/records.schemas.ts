import { z } from "zod";
import { RECORD_TYPES } from "../../constants/domain";

const typeValues = RECORD_TYPES;

export const createRecordSchema = {
  body: z.object({
    amount: z.coerce.number().positive(),
    type: z.enum(typeValues),
    category: z.string().min(2).max(100),
    date: z.string().datetime(),
    notes: z.string().max(500).optional()
  })
};

export const updateRecordSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z
    .object({
      amount: z.coerce.number().positive().optional(),
      type: z.enum(typeValues).optional(),
      category: z.string().min(2).max(100).optional(),
      date: z.string().datetime().optional(),
      notes: z.string().max(500).optional()
    })
    .refine((input) => Object.keys(input).length > 0, "At least one field is required.")
};

export const listRecordsSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    type: z.enum(typeValues).optional(),
    category: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  })
};

export const recordIdParamSchema = {
  params: z.object({
    id: z.string().min(1)
  })
};
