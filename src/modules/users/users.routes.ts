import { Router } from "express";
import { createUser, listUsers, updateUser } from "./users.controller";
import { requireAuth } from "../../middlewares/auth";
import { requirePermission } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";
import { createUserSchema, listUsersSchema, updateUserSchema } from "./users.schemas";

const usersRouter = Router();

usersRouter.use(requireAuth);
usersRouter.use(requirePermission("users", "manage"));

usersRouter.post("/", validate(createUserSchema), createUser);
usersRouter.get("/", validate(listUsersSchema), listUsers);
usersRouter.patch("/:id", validate(updateUserSchema), updateUser);

export { usersRouter };
