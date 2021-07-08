export class CartItem {
  public key: string;
  public __t: string;
  public point: number;
  public price: number;
  public regularPrice: number;
  public quantity: number;
  public checked: boolean;
  public info: any;
  constructor(key: string) {
    this.key = key;
    this.__t = 'CartItem';
    this.point = 0;
    this.price = 0;
    this.regularPrice = 0;
    this.quantity = 1;
    this.checked = true;
  }
}
