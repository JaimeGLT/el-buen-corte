import z from "zod";

export const createMovementSchema = z.object({
  movementType: z.string()
    .min(1, "Debes seleccionar el tipo de movimiento")
    .max(100, "Máximo 100 carácteres"),

  quantity: z.coerce.number()
    .min(1, "Debes ingresar la cantidad"),

  product: z.coerce.number()
    .min(1, "Debes seleccionar un producto"),

  reason: z.string()
    .max(250, "Máximo 250 carácteres")
    .optional()
});
