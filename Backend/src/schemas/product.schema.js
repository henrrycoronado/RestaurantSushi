import { z } from 'zod';

const toNumber = (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : val);

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'El nombre es requerido' }).max(100),
    description: z.string({ required_error: 'La descripción es requerida' }),
    price: z.preprocess(
      toNumber,
      z.number({ required_error: 'El precio es requerido' }).positive('El precio debe ser un número positivo')
    ),
    url_image: z.string().url({ message: 'La URL de la imagen no es válida' }).optional(),
    category_id: z.number({ required_error: 'El ID de la categoría es requerido' }).int().positive(),
  }),
});

export const updateProductSchema = createProductSchema.deepPartial();

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID del producto debe ser un número positivo").transform(Number),
  }),
});