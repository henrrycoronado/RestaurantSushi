import { Router } from 'express';
import * as categoryController from '../controllers/categorias.controller.js';
import { protect, adminOnly } from '../MiddleWare/auth.middleware.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

router.post('/', protect, adminOnly, categoryController.create);
router.put('/:id', protect, adminOnly, categoryController.update);
router.delete('/:id', protect, adminOnly, categoryController.remove);

export default router;