import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "./email.service";

const OTP_EXPIRY_MINUTES = 5;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "CUSTOMER" | "CHEF";
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(
    data.password,
    Number(process.env.BCRYPT_ROUNDS)
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      passwordHash,
    },
  });

  const otp = generateOtp();

  await prisma.otp.create({
    data: {
      userId: user.id,
      code: otp,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    },
  });

  await sendOtpEmail(user.email, otp);

  return { message: "OTP sent to email" };
}

export async function verifyOtp(email: string, otp: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const record = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      code: otp,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) throw new Error("Invalid or expired OTP");

  await prisma.otp.update({
    where: { id: record.id },
    data: { isUsed: true },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { isActive: true },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user };
}
