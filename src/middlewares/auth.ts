import { NextFunction, Request, Response } from "express";
import { USER_STATUSES } from "../constants/domain";
import { verifyAccessToken } from "../utils/jwt";
import { HttpError } from "../utils/httpError";

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing or invalid authorization header."));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verifyAccessToken(token);

    if (decoded.status !== USER_STATUSES[0]) {
      return next(new HttpError(403, "Inactive users cannot access this resource."));
    }

    req.user = decoded;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token."));
  }
};
