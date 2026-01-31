import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "./email.service";
import { ApiError } from "../../utils/api-error";


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
    throw new ApiError("User already exists", 409);
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

   if (!user) {
     throw new ApiError("User not found", 404);
   }

  const record = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      code: otp,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
  });

    if (!record) {
      throw new ApiError("Invalid or expired OTP", 400);
    }

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
    throw new ApiError("Invalid credentials", 401);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

   if (!isValid) {
     throw new ApiError("Invalid credentials", 401);
   }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user };
}
export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user;
}


export async function updateProfile(
  userId: string,
  data: {
    name?: string;
    phone?: string;
    password?: string;
  },
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // Phone uniqueness check
  if (data.phone && data.phone !== user.phone) {
    const exists = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (exists) {
      throw new ApiError("Phone number already in use", 409);
    }
  }

  let passwordHash = user.passwordHash;

  if (data.password) {
    passwordHash = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_ROUNDS),
    );
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name ?? user.name,
      phone: data.phone ?? user.phone,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}
