/** @format */

import { Request } from "express";
import { AuthenticatedRequest } from "../types/auth-request";

export function getAuthUser(req: Request) {
  return (req as AuthenticatedRequest).user;
}
