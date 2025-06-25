import { z } from 'zod';

export const createReservationSchema = z.object({
  body: z.object({
    user_name: z.string({ required_error: 'El nombre del cliente es requerido' }).max(100),
    email: z.string({ required_error: 'El email es requerido' }).email('El formato del email no es válido'),
    phone_number: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres').optional(),
    date: z.string({ required_error: 'La fecha es requerida' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser YYYY-MM-DD'),
    time: z.string({ required_error: 'La hora es requerida' })
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'El formato de hora debe ser HH:MM'),
    diners: z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number({ required_error: 'El número de comensales es requerido' }).int().positive('El número de comensales debe ser mayor a cero')
    ),
  }),
});

export const updateReservationStateSchema = z.object({
  body: z.object({
    state: z.enum(['pendiente', 'confirmada', 'cancelada', 'completada'], {
      required_error: 'El estado es requerido',
    }),
  }),
});

export const reservationIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID de la reservación debe ser un número positivo").transform(Number),
  }),
});