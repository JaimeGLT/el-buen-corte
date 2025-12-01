import z from "zod";

export const createGastosOperativos = z.object({
monto: z.coerce.number()
            .min(1, "El monto debe ser mayor a 0"),
    concepto: z.string().min(1, "Debes ingresar el concepto").max(250, "Máximo 250 carácteres"),
    fecha: z.string().min(1, "Debes ingresar la fecha") 
});

