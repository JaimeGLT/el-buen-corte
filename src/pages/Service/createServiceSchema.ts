import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string()
    .min(3, "Mínimo 3 carácteres")
    .max(50, "Máximo 50 carácteres"),

  price: z.number("El precio debe ser un número" ),
  duration: z.number("La duración debe ser un número" ),

  description: z.string()
    .min(3, "Mínimo 3 carácteres")
    .max(100, "Máximo 100 carácteres"),

  category: z.string().min(1, "Debes seleccionar una categoría")
});

export const EditServiceSchema = z.object({
  name: z.string()
    .min(3, "Mínimo 3 carácteres")
    .max(50, "Máximo 50 carácteres"),

  price: z.number("El precio debe ser un número" ),
  duration: z.number("La duración debe ser un número" ),

  active: z.boolean("Debes seleccionar un estado"),

  description: z.string()
    .min(3, "Mínimo 3 carácteres")
    .max(100, "Máximo 100 carácteres"),

  category: z.string().min(1, "Debes seleccionar una categoría")
});
