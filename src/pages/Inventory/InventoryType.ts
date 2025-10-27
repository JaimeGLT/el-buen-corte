interface Category {
    id: number;
    name: string;
}

export type inventoryType = {
    id: number;
    brand: string;
    category: Category;
    creationDate: string;
    initialStock: number;
    minimumStock: number;
    name: string;
    price: number;
    supplier: string;
}

export type createProductType = {
    name: string,
    brand: string,
    initialStock: number,
    minimumStock: number,
    price: number,
    supplier: string,
    category: number
}