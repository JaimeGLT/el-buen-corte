export type CreateServiceType = {
    name: string;
    description: string;
    category: string;
    price: number,
    duration: number;
}

export type EditServiceType = {
    name: string;
    description: string;
    category: string;
    active: boolean;
    price: number,
    duration: number;
}

export type ServiceCita = {
    active: boolean;
    description: string;
    duration: string;
    id: number;
    name: string;
    price: number;
    type: string;
}