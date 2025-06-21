import { prisma } from '../prisma/client.js';

export const getAllCategories = async () => {
    return await prisma.categories.findMany();
};

export const getCategoryById = async (id) => {
    return await prisma.categories.findUnique({
        where: { id: parseInt(id) },
    });
};

export const createCategory = async (categoryData) => {
    return await prisma.categories.create({
        data: categoryData,
    });
};

export const updateCategory = async (id, categoryData) => {
    return await prisma.categories.update({
        where: { id: parseInt(id) },
        data: categoryData,
    });
};

export const deleteCategory = async (id) => {
    return await prisma.categories.delete({
        where: { id: parseInt(id) },
    });
};