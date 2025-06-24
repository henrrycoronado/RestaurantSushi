import { z } from 'zod';

export const createPublicationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'El título es requerido' }).max(150),
    content: z.string({ required_error: 'El contenido es requerido' }),
  }),
});

export const updatePublicationSchema = createPublicationSchema.deepPartial();

export const publicationIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID de la publicación debe ser un número positivo").transform(Number),
  }),
});