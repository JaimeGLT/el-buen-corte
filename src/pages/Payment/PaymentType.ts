export type CreatePaymentType = {
    amount: number,
    paymentMethod: string,
    clientId: number,
    serviceId: number
}

interface client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    observations: string,
}

interface service {
    id: number;
    name: string;
    description: string;
    type: string;
    active: boolean;
    price: number;
    duration: string;
}

export type Paymenttype = {
    id: number,
    amount: number,
    paymentMethod: string,
    paymentDate: string,
    client: client,
    service: service
}

export type PaymentTodayReportType = {
    totalCashAmountToday: number,
    totalCardAmountToday: number,
    totalQRAmountToday: number,
    totalPaymentAmountToday: number,
    totalTransactionsToday: number
}