/** @format */

import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";


export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      console.log(err);
         next(
           new ApiError(err.errors?.[0]?.message || "Validation failed", 400),
         );
    }
  };
