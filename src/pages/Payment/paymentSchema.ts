import z from "zod";

export const createPaymentSchema = z.object({
    serviceId: z
        .string()
        .min(1, "Debes seleccionar un servicio")
        .transform((val) => Number(val)),
    clientId: z
        .string()
        .min(1, "Debes seleccionar un cliente")
        .transform((val) => Number(val)),
    
    amount: z.coerce.number()
    .min(1, "El monto no puede estar vacío"),

    paymentMethod: z.string().min(1,"Selecciona una metodo de pago")

})