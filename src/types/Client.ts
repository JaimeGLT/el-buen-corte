interface Cita {
    id: number;
    date: string;
    price: number;
    service: string;
    stylist: string;
}

export type ClientType = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    observations: string;
    phoneNumber: string;
    lastVisit: string;
    citas: Cita[];
}