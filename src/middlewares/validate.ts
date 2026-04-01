import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { HttpError } from "../utils/httpError";

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        schemas.query.parse(req.query);
      }

      if (schemas.params) {
        schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new HttpError(400, "Validation failed.", error.flatten()));
      }

      next(error);
    }
  };
};
