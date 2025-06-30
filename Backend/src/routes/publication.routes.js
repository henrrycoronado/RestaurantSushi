import { Router } from 'express';
import * as publicationController from '../controllers/publication.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createPublicationSchema,
  updatePublicationSchema,
  publicationIdSchema,
} from '../schemas/publication.schema.js';
import { likeActionSchema } from '../schemas/publicationLikes.schema.js';

const publicationRoutes = Router();

publicationRoutes.get('/', publicationController.getAll);
publicationRoutes.get('/:id', validate(publicationIdSchema), publicationController.getById);

publicationRoutes.post('/', protect, validate(createPublicationSchema), publicationController.create);
publicationRoutes.put('/:id', protect, validate(publicationIdSchema.merge(updatePublicationSchema)), publicationController.update);
publicationRoutes.delete('/:id', protect, validate(publicationIdSchema), publicationController.remove);

publicationRoutes.post('/:publicationId/like', protect, validate(likeActionSchema), publicationController.like);
publicationRoutes.delete('/:publicationId/like', protect, validate(likeActionSchema), publicationController.unlike);

export default publicationRoutes;