import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

import { validate } from '../middleware/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from '../schemas/category.schema.js';

const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.get('/:id', validate(categoryIdSchema) ,categoryController.getById);

categoryRoutes.post('/', protect, adminOnly, validate(createCategorySchema),categoryController.create);
categoryRoutes.put('/:id', protect, adminOnly,validate(categoryIdSchema.merge(updateCategorySchema)) ,categoryController.update);
categoryRoutes.delete('/:id', protect, adminOnly, validate(categoryIdSchema),categoryController.remove);

export default categoryRoutes;