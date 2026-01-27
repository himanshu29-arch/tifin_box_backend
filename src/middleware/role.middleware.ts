/** @format */

import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};
