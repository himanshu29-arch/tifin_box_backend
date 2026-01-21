import { Request, Response } from "express";
import { registerUser, verifyOtp, loginUser } from "./auth.service";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function verify(req: Request, res: Response) {
  try {
    const result = await verifyOtp(req.body.email, req.body.otp);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
