import type { inventoryType } from "./InventoryType";

export type createMovementType = {
    movementType: string;
    quantity: number;
    product: number;
    reason?: string;
}

export type MovementType = {
    movementType: string;
    quantity: number;
    product: inventoryType;
    reason?: string;
    movementDate: string;
}