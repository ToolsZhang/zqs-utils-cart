import { CartItem } from './CartItem';
export class BundledCartItem extends CartItem {
  public key: string;
  constructor(key: string) {
    super(key);
    this.key = key;
    this.__t = 'BundledCartItem';
  }
}
