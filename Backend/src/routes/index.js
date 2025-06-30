import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import publicationRoutes from './publication.routes.js';
import orderRoutes from './order.routes.js';
import reservationRoutes from './reservation.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/publications', publicationRoutes);
router.use('/orders', orderRoutes);
router.use('/reservations', reservationRoutes);

export default router;