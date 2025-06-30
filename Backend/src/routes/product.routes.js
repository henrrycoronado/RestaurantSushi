import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from '../schemas/product.schema.js';

const productRoutes = Router();

productRoutes.get('/', productController.getAll);
productRoutes.get('/:id', validate(productIdSchema), productController.getById);

productRoutes.post('/', protect, adminOnly, validate(createProductSchema), productController.create);
productRoutes.put('/:id', protect, adminOnly, validate(productIdSchema.merge(updateProductSchema)), productController.update);
productRoutes.delete('/:id', protect, adminOnly, validate(productIdSchema), productController.remove);

export default productRoutes;