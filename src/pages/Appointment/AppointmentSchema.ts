import z from "zod";

export const EditAppointmentSchema = z.object({
    date: z.string("La fecha es obligatoria"),
    time: z.string("La hora es obligatoria"),
client: z
    .string()
    .min(1, "Debes seleccionar un cliente")
    .transform((val) => Number(val)),

  service: z
    .string()
    .min(1, "Debes seleccionar un servicio")
    .transform((val) => Number(val)),

  stylist: z
    .string()
    .min(1, "Debes seleccionar un estilista")
    .transform((val) => Number(val)),
    notes: z.string().max(250, "Máximo 250 carácteres").optional(),
    phoneNumber: z.string().optional(),

    status: z.string().min(1, "El estado no puede estar vácio").max(50, "Máximo 50 carácteres")
})


export const createAppointmentSchema = z.object({
    date: z.string("La fecha es obligatoria"),
    time: z.string("La hora es obligatoria"),
    client: z
      .string()
      .min(1, "Debes seleccionar un cliente")
      .transform((val) => Number(val)),

  service: z
    .string()
    .min(1, "Debes seleccionar un servicio")
    .transform((val) => Number(val)),

  stylist: z
    .string()
    .min(1, "Debes seleccionar un estilista")
    .transform((val) => Number(val)),
    notes: z.string().max(250, "Máximo 250 carácteres").optional(),
    
})