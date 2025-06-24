import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema.js';

const authRoutes = Router();

authRoutes.post('/register', validate(createUserSchema), register);
authRoutes.post('/login', validate(loginUserSchema), login);

export default authRoutes;