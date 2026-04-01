import { z } from "zod";

export const dashboardQuerySchema = {
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    period: z.enum(["monthly", "weekly"]).optional()
  })
};
