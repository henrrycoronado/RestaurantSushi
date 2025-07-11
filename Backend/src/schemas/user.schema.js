import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'El nombre es requerido' }).max(100),
    email: z.string({ required_error: 'El email es requerido' }).email('El formato del email no es válido'),
    phone_number: z.string({ required_error: 'El número de teléfono es requerido' }).min(8, 'El teléfono debe tener al menos 8 caracteres'),
    address: z.string({ required_error: 'La dirección es requerida' }).min(10, 'La dirección debe tener al menos 10 caracteres'),
    password: z.string({ required_error: 'La contraseña es requerida' }).min(8, 'La contraseña debe tener al menos 8 caracteres'),
    rol: z.enum(['usuario', 'admin']).optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'El email es requerido' }).email('Formato de email inválido'),
    password: z.string({ required_error: 'La contraseña es requerida' }),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().max(100).optional(),
    email: z.string().email('Formato de email inválido').optional(),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
    phone_number: z.string().min(8).optional(),
    address: z.string().min(10).optional(),
  }).refine(data => Object.keys(data).length > 0, { message: "Debe proporcionar al menos un campo para actualizar" }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID de usuario debe ser un número positivo").transform(Number),
  }),
});