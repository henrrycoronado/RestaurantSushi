import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.get('/:id', categoryController.getById);

categoryRoutes.post('/', protect, adminOnly, categoryController.create);
categoryRoutes.put('/:id', protect, adminOnly, categoryController.update);
categoryRoutes.delete('/:id', protect, adminOnly, categoryController.remove);

export default categoryRoutes;