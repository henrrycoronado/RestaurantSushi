import { prisma } from '../prisma/client.js';

export const getAllPublications = async () => {
  return await prisma.publications.findMany({
    include: {
      users: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

export const getPublicationById = async (id) => {
  return await prisma.publications.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

export const getPublicationsByUserId = async (userId) => {
  return await prisma.publications.findMany({
    where: { user_id: userId },
  });
};

export const createPublication = async (publicationData) => {
  return await prisma.publications.create({
    data: publicationData,
  });
};

export const updatePublication = async (id, publicationData) => {
  return await prisma.publications.update({
    where: { id },
    data: publicationData,
  });
};

export const deletePublication = async (id) => {
  return await prisma.publications.delete({
    where: { id },
  });
};