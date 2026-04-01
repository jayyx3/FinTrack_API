import { NextFunction, Request, Response } from "express";
import { Action, canAccess, Resource } from "../utils/rbac";
import { HttpError } from "../utils/httpError";

export const requirePermission = (resource: Resource, action: Action) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new HttpError(401, "Authentication is required."));
    }

    if (!canAccess(req.user.role, resource, action)) {
      return next(new HttpError(403, "You do not have permission to perform this action."));
    }

    next();
  };
};
