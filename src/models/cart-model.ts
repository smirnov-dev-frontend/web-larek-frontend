import type { ApiProduct, ICartModel } from '../types';
import type { EventEmitter } from '../components/base/Events';
import { AppEvent } from '../types';

export class CartModel implements ICartModel {
   private items: ApiProduct[] = [];

   constructor(private readonly events: EventEmitter) { }

   addProduct(product: ApiProduct): void {
      if (this.hasProduct(product.id)) return;
      this.items = [...this.items, product];
      this.events.emit(AppEvent.CART_CHANGED, {});
   }

   removeProduct(productId: string): void {
      this.items = this.items.filter((item) => item.id !== productId);
      this.events.emit(AppEvent.CART_CHANGED, {});
   }

   hasProduct(productId: string): boolean {
      return this.items.some((item) => item.id === productId);
   }

   getItems(): readonly ApiProduct[] {
      return this.items;
   }

   getTotalPrice(): number {
      return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
   }

   getCount(): number {
      return this.items.length;
   }

   clear(): void {
      this.items = [];
      this.events.emit(AppEvent.CART_CHANGED, {});
   }
}