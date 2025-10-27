import { z } from 'zod';

export const createClientSchema = z.object({
  firstName: z.string()
    .min(1, "Mínimo 1 carácteres")
    .max(150, "Máximo 150 carácteres"),
  lastName: z.string()
    .min(1, "Mínimo 1 carácteres")
    .max(150, "Máximo 150 carácteres"),

    email: z.email("Debe ser un email válido").optional().or(z.literal("")),

  observations: z.string()
    .max(250, "Máximo 250 carácteres").optional(),

    phoneNumber: z.string().max(20, "Máximo 20 carácteres").optional()
});
