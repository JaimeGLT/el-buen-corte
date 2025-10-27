import type { ServiceCita } from "../Service/CreateServiceType";

export type AppointmentType = {
    id: number;
    client: ClientAppointmentType,
    date: string;
    notes: string;
    service: ServiceCita;
    status: string;
    stylist: any;
    time: string;
    phoneNumber: string;
}

export type EditAppointment = {
    client: number,
    date: string;
    notes?: string;
    service: number;
    status: string;
    stylist: number;
    time: string;
}

export type CreateAppointment = {
    client: number,
    date: string;
    notes?: string;
    service: number;
    stylist: number;
    time: string;
}

export type ClientAppointmentType = {
    id: number,
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    observations?: string,
    email?: string
}