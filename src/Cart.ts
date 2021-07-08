import { CartItem } from './CartItem';
import { ICartStorage } from './ICartStorage';
import { IGift } from './IGift';
import { IRebate } from './IRebate';
export class Cart {
  public storage: ICartStorage;
  public items: CartItem[];
  public rebates: IRebate[];
  public gifts: IGift[];
  public createdAt: number;
  public updatedAt: number;
  constructor(storage: ICartStorage) {
    this.storage = storage;
    this.items = [];
    this.rebates = [];
    this.gifts = [];
    this.createdAt = 0;
    this.updatedAt = 0;
  }
  toJSON() {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      items: this.items,
      gifts: this.gifts,
    };
  }
  fromJSON(json: any) {
    Object.assign(this, json);
  }
  async sync() {
    const data = await this.fetch();
    if (!data) {
      await this.storage.push(this);
    } else if (
      !this.createdAt ||
      !this.updatedAt ||
      data.updatedAt > this.updatedAt
    ) {
      this.pull(data);
    } else {
      await this.storage.push(this);
    }
  }
  async fetch() {
    return await this.storage.fetch(this);
  }
  pull(data: Cart) {
    this.items = data.items;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  async push() {
    const data = await this.storage.push(this);
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  add(item: CartItem) {
    const exist = this.items.find(x => x.key === item.key);
    if (exist) {
      exist.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
    this.updatedAt = new Date().getTime();
  }
  remove(key: string) {
    const index = this.items.findIndex(x => x.key === key);
    if (!!~index) this.items.splice(index, 1);
    this.updatedAt = new Date().getTime();
  }
  increase(item: CartItem, quantity = 1) {
    item.quantity += quantity;
    this.updatedAt = new Date().getTime();
  }
  decrease(item: CartItem, quantity = 1) {
    if (item.quantity > 1) item.quantity -= quantity;
    this.updatedAt = new Date().getTime();
  }

  get price() {
    return this.checkedPrice - this.totalRebateAmount + this.totalGiftAmount;
  }
  get totalRebateAmount() {
    return this.rebates.map(x => x.amount).reduce((a, b) => a + b, 0);
  }
  get totalGiftAmount() {
    return this.checkedGifts
      .filter(x => x.additionalPrice > 0)
      .map(x => x.additionalPrice)
      .reduce((a, b) => a + b, 0);
  }
  get totalPrice() {
    return this.items.map(x => x.price * x.quantity).reduce((a, b) => a + b, 0);
  }
  get totalRegularPrice() {
    return this.items
      .map(x => x.regularPrice * x.quantity)
      .reduce((a, b) => a + b, 0);
  }
  get checkedItems() {
    return this.items.filter(x => x.checked);
  }
  get checkedPoint() {
    return this.checkedItems
      .map(x => x.point * x.quantity)
      .reduce((a, b) => a + b, 0);
  }
  get checkedPrice() {
    return this.checkedItems
      .map(x => x.price * x.quantity)
      .reduce((a, b) => a + b, 0);
  }
  get checkedRegularPrice() {
    return this.checkedItems
      .map(x => x.regularPrice * x.quantity)
      .reduce((a, b) => a + b, 0);
  }
  get countTotalItems() {
    return this.items.map(x => x.quantity).reduce((a, b) => a + b, 0);
  }
  get countCheckedItems() {
    return this.checkedItems.map(x => x.quantity).reduce((a, b) => a + b, 0);
  }
  get availableGifts() {
    return this.gifts.filter(x => x.available);
  }
  get nonAvailableGifts() {
    return this.gifts.filter(x => !x.available);
  }
  get checkedGifts() {
    return this.gifts.filter(x => x.available && x.checked);
  }
  checkout() {
    const items = this.checkedItems;
    for (const item of items) {
      this.remove(item.key);
    }
    return items;
  }
}
