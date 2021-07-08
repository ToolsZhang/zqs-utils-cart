import { CartItem } from './CartItem';
export class SimpleCartItem extends CartItem {
    public key: string;
    constructor(key: string){
        super(key);
        this.key = key;
        this.__t = 'SimpleCartItem';
    };
}
