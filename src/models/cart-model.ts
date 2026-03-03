import type { ApiProduct, ICartModel } from '../types';

export class CartModel implements ICartModel {
   private items: ApiProduct[] = [];

   constructor() { }

   addProduct(product: ApiProduct): void {
      if (this.hasProduct(product.id)) return;
      this.items = [...this.items, product];
   }

   removeProduct(productId: string): void {
      this.items = this.items.filter(p => p.id !== productId);
   }

   hasProduct(productId: string): boolean {
      return this.items.some(p => p.id === productId);
   }

   getItems(): ApiProduct[] {
      return this.items;
   }

   getTotalPrice(): number {
      return this.items.reduce((sum, p) => sum + (p.price ?? 0), 0);
   }

   clear(): void {
      this.items = [];
   }
}