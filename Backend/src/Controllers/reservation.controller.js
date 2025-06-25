import * as ReservationService from '../services/reservation.services.js';

export const create = async (req, res) => {
    try {
        const reservationData = { ...req.body };
        const isoDateTime = new Date(`${reservationData.date}T${reservationData.time}:00`);
        reservationData.date = isoDateTime;
        reservationData.time = isoDateTime;
        const newReservation = await ReservationService.createReservation(reservationData);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const reservations = await ReservationService.getAllReservations();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateState = async (req, res) => {
    try {
        const { id } = req.params;
        const { state } = req.body;
        const updatedReservation = await ReservationService.updateReservation(id, { state });
        res.status(200).json(updatedReservation);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Reservación no encontrada' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const getHistoryByContact = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const reservations = await ReservationService.getReservationsByEmail(userEmail);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};