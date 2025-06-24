import { z } from 'zod';

const orderDetailSchema = z.object({
  product_id: z.number({ required_error: 'El ID del producto es requerido' }).int().positive(),
  amount: z.number({ required_error: 'La cantidad es requerida' }).int().positive('La cantidad debe ser al menos 1'),
});

export const createOrderSchema = z.object({
  body: z.object({
    details: z.array(orderDetailSchema).min(1, 'La orden debe contener al menos un producto'),
  }),
});

export const updateOrderStateSchema = z.object({
    body: z.object({
      state: z.enum(['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'], {
        required_error: 'El estado es requerido',
      }),
    }),
  });

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID de la orden debe ser un número positivo").transform(Number),
  }),
});