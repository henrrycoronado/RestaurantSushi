import { prisma } from '../prisma/client.js';

export const getAllReservations = async () => {
  return await prisma.reservations.findMany();
};

export const getReservationById = async (id) => {
  return await prisma.reservations.findUnique({
    where: { id },
  });
};

export const createReservation = async (reservationData) => {
  return await prisma.reservations.create({
    data: reservationData,
  });
};

export const updateReservation = async (id, reservationData) => {
  return await prisma.reservations.update({
    where: { id },
    data: reservationData,
  });
};

export const deleteReservation = async (id) => {
  return await prisma.reservations.delete({
    where: { id },
  });
};