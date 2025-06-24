import { Router } from 'express';
import * as reservationController from '../controllers/reservation.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createReservationSchema,
  updateReservationStateSchema,
  reservationIdSchema,
} from '../schemas/reservation.schema.js';

const reservationRoutes = Router();

reservationRoutes.post('/', validate(createReservationSchema), reservationController.create);


reservationRoutes.get('/', protect, adminOnly, reservationController.getAll);
reservationRoutes.patch('/:id/state', protect, adminOnly, validate(reservationIdSchema.merge(updateReservationStateSchema)), reservationController.updateState);

export default reservationRoutes;