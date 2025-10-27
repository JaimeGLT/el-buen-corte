export type Service = {
    id: number;
    name: string;
    description: string;
    type: string;
    price: number;
    duration: number;
    servicesThisMonth: number;
    incomeGenerated: number;
    popularityPercentage: number;
    active: boolean;
}