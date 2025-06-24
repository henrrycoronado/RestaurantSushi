import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'El nombre es requerido',
    }).min(1, 'El nombre no puede estar vacío').max(50, 'El nombre no puede exceder los 50 caracteres'),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string({
        required_error: 'El nombre es requerido',
    }).min(1).max(50).optional(),
  }),
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número positivo").transform(Number),
  }),
});
