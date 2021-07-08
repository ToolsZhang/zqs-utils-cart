import { CartItem } from './CartItem';
export class GiftRebateCartItem extends CartItem {
  public key: string;
  constructor(key: string) {
    super(key);
    this.key = key;
    this.__t = 'GiftRebateCartItem';
  }
}
