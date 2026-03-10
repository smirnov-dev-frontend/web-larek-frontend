import type { EventEmitter } from '../components/base/Events';
import type { IProductModel, ApiProduct } from '../types';
import { AppEvent } from '../types';

export class ProductModel implements IProductModel {
   private products: ApiProduct[] = [];
   private selectedProduct: ApiProduct | null = null;

   constructor(private readonly events: EventEmitter) { }

   setProducts(products: ApiProduct[]): void {
      this.products = products;
      this.events.emit(AppEvent.CATALOG_CHANGED, {});
   }

   getProducts(): readonly ApiProduct[] {
      return this.products;
   }

   getProductById(id: string): ApiProduct | undefined {
      return this.products.find((product) => product.id === id);
   }

   setSelectedProduct(product: ApiProduct): void {
      this.selectedProduct = product;
   }

   getSelectedProduct(): ApiProduct | undefined {
      return this.selectedProduct ?? undefined;
   }

   clearSelectedProduct(): void {
      this.selectedProduct = null;
   }
}