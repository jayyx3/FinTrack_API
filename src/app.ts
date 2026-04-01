import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { recordsRouter } from "./modules/records/records.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { apiLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { openApiSpec } from "./docs/openapi";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(apiLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Finance API is running.",
    docs: "/docs",
    health: "/health"
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/records", recordsRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
