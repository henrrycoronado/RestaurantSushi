import { prisma } from '../prisma/client.js';

function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
}

export const getAllUsers = async () => {
  const users = await prisma.users.findMany();
  return users.map(user => exclude(user, ['password']));
};

export const getUserById = async (id) => {
  const user = await prisma.users.findUnique({
    where: { id },
  });
  if (user) {
    return exclude(user, ['password']);
  }
  return null;
};

export const getUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

export const createUser = async (userData) => {
  const user = await prisma.users.create({
    data: userData,
  });
  return exclude(user, ['password']);
};

export const updateUser = async (id, userData) => {
  const user = await prisma.users.update({
    where: { id },
    data: userData,
  });
  return exclude(user, ['password']);
};

export const deleteUser = async (id) => {
  return await prisma.users.delete({
    where: { id },
  });
};