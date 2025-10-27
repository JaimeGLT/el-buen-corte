export type ClientType = {
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    observations?: string,
    email?: string
}

interface Cita {
    date: string;
    id: number;
    price: number;
    service: string;
    stylist: string;
}

export type ClientDetailType = {
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    lastVisit: string;
    observations: string;
    phoneNumber: string;
    citas: Cita[]
}