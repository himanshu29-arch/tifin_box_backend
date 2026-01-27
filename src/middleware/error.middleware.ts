/** @format */

import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  /* ---------------- ZOD VALIDATION ERRORS ---------------- */
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues.map((issue) => issue.message).join(", "),
    });
  }

  // ✅ Custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // ✅ Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }
  }

  // ❌ Never expose internals
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again.",
  });
}
