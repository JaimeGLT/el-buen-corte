import z from "zod";

export const personalCreateSchema = z.object({
    firstName: z.string().min(1, "El nombre no puede estar vacío").max(150, "Máximo 150 carácteres"),
    lastName: z.string().min(1, "El apellido no puede estar vacío").max(150, "Máximo 150 carácteres"),
    email: z.email("Debes introducir un email válido").min(1, "El email no puede estar vacio").max(150, "Máximo 150 carácteres"),
    phoneNumber: z.string().min(1, "El número de teléfono no puede estar vacío").max(150, "Máximo 150 carácteres"),
    workingHoursStart: z.string().min(1, "Debes introducir las horas de inicio").max(10, "Máximo 10 carácteres"),
    workingHoursFinish: z.string().min(1, "Debes introducir las horas de finalización").max(10, "Máximo 10 carácteres"),
    role: z.string().min(1, "Debes seleccionar un rol").max(10, "Máximo 10 carácteres"),
    specialties: z.string().min(1, "Debes introducir almenos una especialidad").max(250, "Máximo 250 carácteres")
})