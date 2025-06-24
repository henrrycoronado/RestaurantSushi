import { z } from 'zod';

export const likeActionSchema = z.object({
  params: z.object({
    publicationId: z.string().regex(/^\d+$/, "El ID de la publicación debe ser un número positivo").transform(Number),
  }),
});