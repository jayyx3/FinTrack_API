import { z } from "zod";
import { ROLES, USER_STATUSES } from "../../constants/domain";

const roleValues = ROLES;
const statusValues = USER_STATUSES;

export const createUserSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    role: z.enum(roleValues),
    status: z.enum(statusValues).optional()
  })
};

export const updateUserSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      role: z.enum(roleValues).optional(),
      status: z.enum(statusValues).optional()
    })
    .refine((input) => Object.keys(input).length > 0, "At least one field is required.")
};

export const listUsersSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    role: z.enum(roleValues).optional(),
    status: z.enum(statusValues).optional()
  })
};
