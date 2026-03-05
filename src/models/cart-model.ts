import type { ICartModel } from '../types';

export class CartModel implements ICartModel {
   private items: string[] = [];

   constructor() { }

   addProduct(productId: string): void {
      if (this.hasProduct(productId)) return;
      this.items = [...this.items, productId];
   }

   removeProduct(productId: string): void {
      this.items = this.items.filter((id) => id !== productId);
   }

   hasProduct(productId: string): boolean {
      return this.items.includes(productId);
   }

   getItems(): string[] {
      return this.items;
   }

   clear(): void {
      this.items = [];
   }
}