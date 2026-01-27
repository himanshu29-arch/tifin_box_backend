/** @format */

import "express-serve-static-core";
import { JwtPayload } from "../../modules/auth/jwt.util";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}


