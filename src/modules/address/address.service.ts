/** @format */

import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const createAddress = async (
  userId: string,
  data: {
    receiverName: string;
    contactNumber: string;
    houseNumber: string;
    sector: string;
    landmark?: string;
    postcode: string;
    mapUrl?: string;
    isDefault?: boolean;
  },
) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const getMyAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: any,
) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new ApiError("Address not found", 404);
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data,
  });
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new ApiError("Address not found", 404);
  }

  return prisma.address.delete({
    where: { id: addressId },
  });
};
