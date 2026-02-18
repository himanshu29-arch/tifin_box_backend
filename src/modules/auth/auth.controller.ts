import { Request, Response, NextFunction } from "express";
import { registerUser, verifyOtp, loginUser, getMe, forgotPasswordService, resetPasswordService } from "./auth.service";
import { AuthenticatedRequest } from "../../types/auth-request";
import { updateProfile as updateProfileService } from "./auth.service";
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
   const result = await registerUser(req.body);
   res.json({ success: true, data: result });
  } catch (err) {
    next(err);

  }
}

export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await verifyOtp(req.body.email, req.body.otp);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    res.json({ success: true, data: result });
  } catch (err) {
     next(err);
  }
}


export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const user = await getMe(authReq.user.userId);
    res.json({ success: true, data: user });
  } catch (err) {
      next(err);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authReq = req as AuthenticatedRequest;

    const user = await updateProfileService(
      authReq.user.userId,
      req.body,
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

// Notice:
// No if (!req.user) needed anymore
// TypeScript guarantees req.user exists

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await forgotPasswordService(req.body.email);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await resetPasswordService(
      req.body.email,
      req.body.otp,
      req.body.newPassword
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
