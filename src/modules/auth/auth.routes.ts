import { Router } from "express";
import { login, me } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { loginSchema } from "./auth.schemas";
import { requireAuth } from "../../middlewares/auth";

const authRouter = Router();

authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/me", requireAuth, me);

export { authRouter };
