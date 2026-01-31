/** @format */

import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const createCategory = async (data: {
  name: string;
  imageUrl?: string;
}) => {
  return prisma.category.create({
    data,
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });
};

export const updateCategory = async (
  id: string,
  data: { name?: string; imageUrl?: string },
) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};
