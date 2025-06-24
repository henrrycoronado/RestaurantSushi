import { prisma } from '../prisma/client.js';

export const getAllProducts = async () => {
  return await prisma.products.findMany({
    include: {
      categories: true,
    },
  });
};

export const getProductById = async (id) => {
  return await prisma.products.findUnique({
    where: { id },
    include: {
      categories: true,
    },
  });
};

export const createProduct = async (productData) => {
  return await prisma.products.create({
    data: productData,
  });
};

export const updateProduct = async (id, productData) => {
  return await prisma.products.update({
    where: { id },
    data: productData,
  });
};

export const deleteProduct = async (id) => {
  return await prisma.products.delete({
    where: { id },
  });
};