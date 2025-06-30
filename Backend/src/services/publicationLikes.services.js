import { prisma } from '../prisma/client.js';

export const likePublication = async (userId, publicationId) => {
  return await prisma.likespublications.create({
    data: {
      user_id: userId,
      publication_id: publicationId,
    },
  });
};

export const unlikePublication = async (userId, publicationId) => {
  return await prisma.likespublications.delete({
    where: {
      user_id_publication_id: { 
        user_id: userId,
        publication_id: publicationId,
      },
    },
  });
};

export const getLikesCountForPublication = async (publicationId) => {
    return await prisma.likespublications.count({
        where: { publication_id: publicationId },
    });
};


export const checkIfUserLiked = async (userId, publicationId) => {
    const like = await prisma.likespublications.findUnique({
        where: {
            user_id_publication_id: {
                user_id: userId,
                publication_id: publicationId,
            }
        }
    });
    return !!like;
};