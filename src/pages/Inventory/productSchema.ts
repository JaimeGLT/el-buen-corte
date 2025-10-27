import { z } from "zod";

export const createProductSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre no puede estar vacío")
        .max(100, "Máximo 100 caracteres"),

    brand: z
        .string()
        .min(1, "La marca no puede estar vacía")
        .max(200, "Máximo 200 caracteres"),

    initialStock: z.preprocess(
        (val) => Number(val),
        z.number().min(0, "Debes ingresar un stock inicial")
    ),

    minimumStock: z.preprocess(
        (val) => Number(val),
        z.number().min(0, "Debes ingresar un stock mínimo")
    ),

    price: z.preprocess(
        (val) => Number(val),
        z.number().min(0, "El precio es requerido")
    ),

    category: z.preprocess(
        (val) => Number(val),
        z.number().min(0, "El precio es requerido")
    ),

    supplier: z
        .string()
        .min(1, "Debes ingresar un proveedor")
        .max(200, "Máximo 200 caracteres"),
});
