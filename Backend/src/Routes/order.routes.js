import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createOrderSchema,
  updateOrderStateSchema,
  orderIdSchema,
} from '../schemas/order.schema.js';

const orderRoutes = Router();

orderRoutes.post('/', protect, validate(createOrderSchema), orderController.create);
orderRoutes.get('/my-orders', protect, orderController.getMyOrders);
orderRoutes.get('/:id', protect, validate(orderIdSchema), orderController.getOrderById);

orderRoutes.get('/admin', protect, adminOnly, orderController.getAllOrders);
orderRoutes.patch('/:id/state', protect, adminOnly, validate(orderIdSchema.merge(updateOrderStateSchema)), orderController.updateOrderState);

export default orderRoutes;