/** @format */

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../modules/auth/jwt.util";
import { AuthenticatedRequest } from "../types/auth-request";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  try {
    const payload = verifyToken(token);
    
    // ✅ CAST ONCE — THIS IS THE KEY
    (req as AuthenticatedRequest).user = payload; // 👈 attach user to request

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
