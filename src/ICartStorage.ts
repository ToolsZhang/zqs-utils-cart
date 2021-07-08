import { Cart } from './Cart';
export interface ICartStorage {
    fetch(cart: Cart): Promise<Cart>;
    push(cart: Cart): Promise<{
        createdAt: number;
        updatedAt: number;
    }>;
}